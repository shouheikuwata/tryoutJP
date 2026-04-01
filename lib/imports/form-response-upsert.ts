import { prisma } from "@/lib/db/prisma";
import { encrypt } from "@/lib/encryption/field-encryption";
import { fileSha256 } from "@/lib/utils/csv";
import { parseFormResponseCsv } from "./form-response-parser";
import { validateRow, type ValidatedRow, type ValidationError } from "./form-response-validator";

export interface ImportResult {
  batchId: string;
  status: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  duplicateRows: number;
  errors: ValidationError[];
}

export async function importFormResponses(
  facilityId: string,
  fileName: string,
  csvContent: string,
  importedBy: string
): Promise<ImportResult> {
  const sha256 = fileSha256(csvContent);

  // Check duplicate file
  const existing = await prisma.formResponseImportBatch.findUnique({
    where: { facilityId_fileSha256: { facilityId, fileSha256: sha256 } },
  });
  if (existing) {
    return {
      batchId: existing.id,
      status: "duplicate_file",
      totalRows: 0,
      successRows: 0,
      failedRows: 0,
      duplicateRows: 0,
      errors: [{ rowNumber: 0, field: "", reason: "duplicate_file", message: "同一ファイルが既に取り込まれています" }],
    };
  }

  const parseResult = parseFormResponseCsv(csvContent);
  if (parseResult.missingHeaders.length > 0) {
    return {
      batchId: "",
      status: "header_error",
      totalRows: 0,
      successRows: 0,
      failedRows: 0,
      duplicateRows: 0,
      errors: [{ rowNumber: 0, field: "", reason: "missing_headers", message: `必須ヘッダーが不足: ${parseResult.missingHeaders.join(", ")}` }],
    };
  }

  // Create batch
  const batch = await prisma.formResponseImportBatch.create({
    data: {
      facilityId,
      fileName,
      fileSha256: sha256,
      totalRows: parseResult.rows.length,
      status: "processing",
      importedBy,
      startedAt: new Date(),
    },
  });

  const validRows: ValidatedRow[] = [];
  const errors: ValidationError[] = [];
  let duplicateRows = 0;

  // Validate all rows
  for (const row of parseResult.rows) {
    const result = validateRow(row);
    if (result.error) {
      errors.push(result.error);
    } else if (result.data) {
      validRows.push(result.data);
    }
  }

  let successRows = 0;

  // Process valid rows
  for (const row of validRows) {
    try {
      // Check for duplicate session (same phone hash + same timestamp for this facility)
      const existingSession = await prisma.usageSession.findFirst({
        where: {
          facilityId,
          rawPhoneHash: row.phoneHash,
          sessionStartedAt: row.normalizedTimestamp,
          deletedAt: null,
        },
      });

      if (existingSession) {
        duplicateRows++;
        await prisma.formResponseImportRow.create({
          data: {
            batchId: batch.id,
            facilityId,
            rowNumber: row.rowNumber,
            sourceTimestampText: row.sourceTimestampText,
            phoneText: row.phoneText,
            usedBeforeText: row.usedBeforeText,
            nicknameText: row.nicknameText,
            cityText: row.cityText,
            birthDateText: row.birthDateText,
            visitPurposeText: row.visitPurposeText,
            usageTriggerText: row.usageTriggerText,
            externalDeviceIdText: row.externalDeviceIdText,
            normalizedPhoneHash: row.phoneHash,
            normalizedTimestamp: row.normalizedTimestamp,
            mappedVisitPurpose: row.visitPurpose,
            mappedUsageTrigger: row.usageTrigger,
            resultStatus: "duplicate",
          },
        });
        continue;
      }

      // Upsert end user by (facility_id, phone_hash)
      const endUser = await prisma.endUser.upsert({
        where: {
          facilityId_phoneHash: { facilityId, phoneHash: row.phoneHash },
        },
        create: {
          facilityId,
          phoneEncrypted: encrypt(row.normalizedPhone),
          phoneHash: row.phoneHash,
          nickname: row.nickname || null,
          city: row.city || null,
          birthDateEncrypted: encrypt(row.birthDate.toISOString()),
          birthYear: row.birthYear,
          ageBucket: row.ageBucket,
          hasUsedBeforeAnswer: row.hasUsedBefore,
          firstSeenAt: row.normalizedTimestamp,
          lastSeenAt: row.normalizedTimestamp,
        },
        update: {
          nickname: row.nickname || undefined,
          city: row.city || undefined,
          lastSeenAt: row.normalizedTimestamp,
        },
      });

      // Check if first use at facility
      const sessionCount = await prisma.usageSession.count({
        where: { facilityId, endUserId: endUser.id, deletedAt: null },
      });
      const isFirstUse = sessionCount === 0;

      // Upsert device if provided
      let deviceId: string | null = null;
      if (row.externalDeviceId) {
        const device = await prisma.facilityDevice.upsert({
          where: {
            facilityId_externalDeviceId: { facilityId, externalDeviceId: row.externalDeviceId },
          },
          create: {
            facilityId,
            externalDeviceId: row.externalDeviceId,
            deviceType: "hair_iron_box",
            status: "active",
          },
          update: {},
        });
        deviceId = device.id;
      }

      // Create import row record
      const importRow = await prisma.formResponseImportRow.create({
        data: {
          batchId: batch.id,
          facilityId,
          rowNumber: row.rowNumber,
          sourceTimestampText: row.sourceTimestampText,
          phoneText: row.phoneText,
          usedBeforeText: row.usedBeforeText,
          nicknameText: row.nicknameText,
          cityText: row.cityText,
          birthDateText: row.birthDateText,
          visitPurposeText: row.visitPurposeText,
          usageTriggerText: row.usageTriggerText,
          externalDeviceIdText: row.externalDeviceIdText,
          normalizedPhoneHash: row.phoneHash,
          normalizedTimestamp: row.normalizedTimestamp,
          mappedVisitPurpose: row.visitPurpose,
          mappedUsageTrigger: row.usageTrigger,
          resultStatus: "imported",
        },
      });

      // Create usage session
      await prisma.usageSession.create({
        data: {
          facilityId,
          endUserId: endUser.id,
          deviceId,
          sessionStartedAt: row.normalizedTimestamp,
          isFirstUseAtFacility: isFirstUse,
          visitPurpose: row.visitPurpose,
          usageTrigger: row.usageTrigger,
          usedBeforeAnswer: row.hasUsedBefore,
          sessionSource: "onsite_form_csv",
          rawPhoneHash: row.phoneHash,
          rawCity: row.city || null,
          rawBirthDateEncrypted: encrypt(row.birthDate.toISOString()),
          rawNickname: row.nickname || null,
          importRowId: importRow.id,
        },
      });

      successRows++;
    } catch (error) {
      console.error(`[IMPORT_ROW_ERROR] Row ${row.rowNumber}:`, error);
      errors.push({
        rowNumber: row.rowNumber,
        field: "",
        reason: "processing_error",
        message: `処理エラー: ${String(error)}`,
      });

      await prisma.formResponseImportRow.create({
        data: {
          batchId: batch.id,
          facilityId,
          rowNumber: row.rowNumber,
          sourceTimestampText: row.sourceTimestampText,
          phoneText: row.phoneText,
          resultStatus: "failed",
          errorCode: "processing_error",
          errorMessage: String(error),
        },
      });
    }
  }

  // Also record validation errors as import rows
  for (const err of errors.filter((e) => e.rowNumber > 0)) {
    const existingRow = await prisma.formResponseImportRow.findFirst({
      where: { batchId: batch.id, rowNumber: err.rowNumber },
    });
    if (!existingRow) {
      const rawRow = parseResult.rows.find((r) => r.rowNumber === err.rowNumber);
      await prisma.formResponseImportRow.create({
        data: {
          batchId: batch.id,
          facilityId,
          rowNumber: err.rowNumber,
          sourceTimestampText: rawRow?.timestamp,
          phoneText: rawRow?.phone,
          resultStatus: "failed",
          errorCode: err.reason,
          errorMessage: err.message,
        },
      });
    }
  }

  const failedRows = errors.filter((e) => e.rowNumber > 0).length;
  const finalStatus =
    failedRows === 0 && duplicateRows === 0
      ? "completed"
      : successRows === 0
        ? "failed"
        : "partially_completed";

  await prisma.formResponseImportBatch.update({
    where: { id: batch.id },
    data: {
      successRows,
      failedRows,
      status: finalStatus,
      completedAt: new Date(),
    },
  });

  return {
    batchId: batch.id,
    status: finalStatus,
    totalRows: parseResult.rows.length,
    successRows,
    failedRows,
    duplicateRows,
    errors,
  };
}

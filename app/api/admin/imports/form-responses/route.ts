import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { importFormResponses } from "@/lib/imports/form-response-upsert";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const facilityId = formData.get("facilityId") as string;
    const file = formData.get("file") as File;

    if (!facilityId || !file) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "施設IDとファイルが必要です" } },
        { status: 400 }
      );
    }

    const csvContent = await file.text();
    const result = await importFormResponses(facilityId, file.name, csvContent, session.user.id);

    await writeAuditLog({
      actorUserId: session.user.id,
      actorRole: "platform_admin",
      facilityId,
      action: "form_response_import_completed",
      targetType: "form_response_import_batch",
      targetId: result.batchId || undefined,
      metadata: {
        fileName: file.name,
        totalRows: result.totalRows,
        successRows: result.successRows,
        failedRows: result.failedRows,
        duplicateRows: result.duplicateRows,
      },
    });

    return NextResponse.json({
      batchId: result.batchId,
      status: result.status,
      summary: {
        totalRows: result.totalRows,
        successRows: result.successRows,
        failedRows: result.failedRows,
        duplicateRows: result.duplicateRows,
      },
      errors: result.errors.filter((e) => e.rowNumber > 0),
    });
  } catch (error) {
    console.error("[IMPORT_ERROR]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "CSV取込に失敗しました" } },
      { status: 500 }
    );
  }
}

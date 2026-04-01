import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create facilities
  const facility1 = await prisma.facility.upsert({
    where: { code: "GINZA001" },
    update: {},
    create: {
      code: "GINZA001",
      name: "サンプル百貨店 銀座店",
      email: "ginza@example.com",
      prefecture: "東京都",
      city: "中央区",
      addressLine1: "銀座1-2-3",
      industry: "百貨店",
      status: "active",
    },
  });

  const facility2 = await prisma.facility.upsert({
    where: { code: "SHIBUYA001" },
    update: {},
    create: {
      code: "SHIBUYA001",
      name: "サンプル商業施設 渋谷店",
      email: "shibuya@example.com",
      prefecture: "東京都",
      city: "渋谷区",
      addressLine1: "渋谷2-3-4",
      industry: "商業施設",
      status: "active",
    },
  });

  const facility3 = await prisma.facility.upsert({
    where: { code: "YOKOHAMA001" },
    update: {},
    create: {
      code: "YOKOHAMA001",
      name: "サンプル百貨店 横浜店",
      email: "yokohama@example.com",
      prefecture: "神奈川県",
      city: "横浜市西区",
      addressLine1: "高島1-2-3",
      industry: "百貨店",
      status: "active",
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 12);

  // Create platform admin
  await prisma.facilityUser.upsert({
    where: { email: "admin@beautyspot.example" },
    update: {},
    create: {
      facilityId: null,
      role: "platform_admin",
      email: "admin@beautyspot.example",
      passwordHash,
      name: "管理者",
      isActive: true,
    },
  });

  // Create facility viewers
  await prisma.facilityUser.upsert({
    where: { email: "ginza@example.com" },
    update: {},
    create: {
      facilityId: facility1.id,
      role: "facility_viewer",
      email: "ginza@example.com",
      passwordHash,
      name: "銀座店担当",
      isActive: true,
    },
  });

  await prisma.facilityUser.upsert({
    where: { email: "shibuya@example.com" },
    update: {},
    create: {
      facilityId: facility2.id,
      role: "facility_viewer",
      email: "shibuya@example.com",
      passwordHash,
      name: "渋谷店担当",
      isActive: true,
    },
  });

  await prisma.facilityUser.upsert({
    where: { email: "yokohama@example.com" },
    update: {},
    create: {
      facilityId: facility3.id,
      role: "facility_viewer",
      email: "yokohama@example.com",
      passwordHash,
      name: "横浜店担当",
      isActive: true,
    },
  });

  // Create email settings
  await prisma.emailSetting.upsert({
    where: { key: "inquiry_auto_reply" },
    update: {},
    create: {
      key: "inquiry_auto_reply",
      subject: "Beauty Spotへのお問い合わせありがとうございます",
      bodyText: "この度はお問い合わせありがとうございます。以下より資料をご確認ください。",
      materialDownloadUrl: "https://example.com/material.pdf",
    },
  });

  await prisma.emailSetting.upsert({
    where: { key: "contract_application_admin_notification" },
    update: {},
    create: {
      key: "contract_application_admin_notification",
      subject: "【Beauty Spot】新規契約申込",
      bodyText: "新規契約申込がありました。管理画面から確認してください。",
    },
  });

  // Create dummy inquiries
  await prisma.inquiry.createMany({
    skipDuplicates: true,
    data: [
      {
        companyName: "テスト百貨店株式会社",
        contactName: "山田太郎",
        email: "yamada@test-dept.example",
        facilityName: "テスト百貨店 本店",
        status: "new",
      },
      {
        companyName: "サンプル商業施設株式会社",
        contactName: "鈴木花子",
        email: "suzuki@sample-mall.example",
        facilityName: "サンプルモール 渋谷",
        status: "contacted",
      },
    ],
  });

  // Create dummy monthly metrics for facility1
  const months = [1, 2, 3];
  for (const month of months) {
    const base = 300 + Math.floor(Math.random() * 200);
    const unique = Math.floor(base * 0.75);
    const newUsers = Math.floor(unique * 0.45);
    const repeatUsers = unique - newUsers;

    await prisma.facilityMonthlyMetric.upsert({
      where: {
        facilityId_metricYear_metricMonth: {
          facilityId: facility1.id,
          metricYear: 2026,
          metricMonth: month,
        },
      },
      update: {},
      create: {
        facilityId: facility1.id,
        metricYear: 2026,
        metricMonth: month,
        usageCount: base,
        uniqueUserCount: unique,
        newUserCount: newUsers,
        repeatUserCount: repeatUsers,
        repeatRate: Number(((repeatUsers / unique) * 100).toFixed(2)),
        newRate: Number(((newUsers / unique) * 100).toFixed(2)),
        averageUsageIntervalDays: 18 + Math.random() * 5,
        repeatContinuationRate: 38 + Math.random() * 10,
        avgUsesPerUser: 1.2 + Math.random() * 0.3,
        secondUseMedianDays: 20 + Math.random() * 10,
      },
    });

    // Dimension metrics
    const dimensions = [
      { type: "age_bucket", values: [{ v: "age_20_24", c: 120 }, { v: "age_25_29", c: 100 }, { v: "age_30_34", c: 60 }, { v: "age_35_39", c: 30 }, { v: "age_40_49", c: 20 }] },
      { type: "visit_purpose", values: [{ v: "shopping", c: 180 }, { v: "dining", c: 60 }, { v: "work_commute", c: 40 }, { v: "event", c: 30 }, { v: "meeting", c: 20 }] },
      { type: "usage_trigger", values: [{ v: "rain_humidity", c: 100 }, { v: "before_date", c: 70 }, { v: "before_after_work", c: 60 }, { v: "just_refresh", c: 50 }, { v: "sweat", c: 30 }] },
      { type: "weekday", values: [{ v: "月", c: 42 }, { v: "火", c: 45 }, { v: "水", c: 40 }, { v: "木", c: 48 }, { v: "金", c: 58 }, { v: "土", c: 52 }, { v: "日", c: 38 }] },
      { type: "hour_of_day", values: [{ v: "10", c: 15 }, { v: "11", c: 25 }, { v: "12", c: 40 }, { v: "13", c: 50 }, { v: "14", c: 55 }, { v: "15", c: 50 }, { v: "16", c: 45 }, { v: "17", c: 60 }, { v: "18", c: 65 }, { v: "19", c: 40 }, { v: "20", c: 20 }] },
      { type: "city", values: [{ v: "東京都中央区", c: 60 }, { v: "東京都渋谷区", c: 45 }, { v: "東京都港区", c: 40 }, { v: "神奈川県横浜市", c: 35 }, { v: "東京都新宿区", c: 30 }] },
    ];

    for (const dim of dimensions) {
      const total = dim.values.reduce((s, v) => s + v.c, 0);
      for (const val of dim.values) {
        await prisma.facilityMonthlyDimensionMetric.upsert({
          where: {
            facilityId_metricYear_metricMonth_dimensionType_dimensionValue: {
              facilityId: facility1.id,
              metricYear: 2026,
              metricMonth: month,
              dimensionType: dim.type,
              dimensionValue: val.v,
            },
          },
          update: {},
          create: {
            facilityId: facility1.id,
            metricYear: 2026,
            metricMonth: month,
            dimensionType: dim.type,
            dimensionValue: val.v,
            usageCount: val.c + Math.floor(Math.random() * 10),
            uniqueUserCount: Math.floor(val.c * 0.8),
            percentage: Number(((val.c / total) * 100).toFixed(1)),
          },
        });
      }
    }
  }

  // Create cumulative metrics for facility1
  await prisma.facilityCumulativeMetric.upsert({
    where: { facilityId: facility1.id },
    update: {},
    create: {
      facilityId: facility1.id,
      usageCount: 1200,
      uniqueUserCount: 850,
      newUserCount: 420,
      repeatUserCount: 430,
      repeatRate: 50.59,
      newRate: 49.41,
      averageUsageIntervalDays: 19.5,
      repeatContinuationRate: 42.8,
      avgUsesPerUser: 1.41,
      secondUseMedianDays: 24,
    },
  });

  // Cumulative dimension metrics
  const cumulativeDims = [
    { type: "repeat_frequency_bucket", values: [{ v: "once", c: 420 }, { v: "twice", c: 200 }, { v: "three_to_five", c: 150 }, { v: "six_to_ten", c: 50 }, { v: "eleven_plus", c: 30 }] },
    { type: "second_use_lag_bucket", values: [{ v: "within_7_days", c: 80 }, { v: "within_30_days", c: 200 }, { v: "within_90_days", c: 100 }, { v: "after_90_days", c: 30 }, { v: "no_second_use", c: 420 }] },
  ];
  for (const dim of cumulativeDims) {
    const total = dim.values.reduce((s, v) => s + v.c, 0);
    for (const val of dim.values) {
      await prisma.facilityCumulativeDimensionMetric.upsert({
        where: {
          facilityId_dimensionType_dimensionValue: {
            facilityId: facility1.id,
            dimensionType: dim.type,
            dimensionValue: val.v,
          },
        },
        update: {},
        create: {
          facilityId: facility1.id,
          dimensionType: dim.type,
          dimensionValue: val.v,
          usageCount: val.c,
          uniqueUserCount: Math.floor(val.c * 0.9),
          percentage: Number(((val.c / total) * 100).toFixed(1)),
        },
      });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

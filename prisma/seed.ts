import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------- helpers ----------
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pct(part: number, total: number) {
  return total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0;
}

// ---------- dimension templates ----------
const AGE_BUCKETS   = ["under_20", "age_20_24", "age_25_29", "age_30_34", "age_35_39", "age_40_49", "age_50_plus"];
const AGE_WEIGHTS   = [5, 28, 25, 18, 12, 8, 4];

const PURPOSES      = ["shopping", "dining", "work_commute", "event", "meeting", "other"];
const PURPOSE_W     = [42, 18, 14, 12, 8, 6];

const TRIGGERS      = ["rain_humidity", "before_date", "before_after_work", "just_refresh", "sweat", "wind", "before_event", "before_photo", "other"];
const TRIGGER_W     = [24, 16, 14, 13, 10, 8, 7, 5, 3];

const WEEKDAYS      = ["月", "火", "水", "木", "金", "土", "日"];
const WEEKDAY_W     = [12, 13, 11, 14, 17, 18, 15];

const HOURS         = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const HOUR_W        = [3, 5, 8, 11, 13, 14, 13, 12, 15, 16, 10, 5];

const CITIES_GINZA  = ["東京都中央区", "東京都渋谷区", "東京都港区", "神奈川県横浜市", "東京都新宿区", "東京都品川区", "千葉県船橋市", "埼玉県さいたま市", "東京都豊島区", "東京都世田谷区"];
const CITIES_SHIBUYA = ["東京都渋谷区", "東京都世田谷区", "東京都目黒区", "東京都新宿区", "東京都港区", "神奈川県川崎市", "神奈川県横浜市", "東京都杉並区", "東京都中野区", "埼玉県さいたま市"];
const CITIES_YOKOHAMA = ["神奈川県横浜市", "神奈川県川崎市", "東京都品川区", "東京都大田区", "神奈川県藤沢市", "神奈川県鎌倉市", "東京都渋谷区", "神奈川県相模原市", "静岡県熱海市", "千葉県千葉市"];
const CITY_W        = [22, 15, 12, 10, 9, 8, 7, 6, 6, 5];

const REPEAT_FREQ   = ["once", "twice", "three_to_five", "six_to_ten", "eleven_plus"];
const REPEAT_FREQ_W = [45, 22, 20, 9, 4];

const LAG_BUCKETS   = ["within_7_days", "within_30_days", "within_90_days", "after_90_days", "no_second_use"];
const LAG_W         = [10, 30, 22, 8, 30];

function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const base = weights.map((w) => Math.floor((w / sum) * total));
  // add jitter
  return base.map((v) => Math.max(1, v + rand(-Math.floor(v * 0.15), Math.floor(v * 0.15))));
}

// ---------- main ----------
async function main() {
  console.log("Seeding database...");

  // ---- Facilities ----
  const facility1 = await prisma.facility.upsert({
    where: { code: "GINZA001" },
    update: {},
    create: { code: "GINZA001", name: "サンプル百貨店 銀座店", email: "ginza@example.com", prefecture: "東京都", city: "中央区", addressLine1: "銀座1-2-3", industry: "百貨店", status: "active" },
  });
  const facility2 = await prisma.facility.upsert({
    where: { code: "SHIBUYA001" },
    update: {},
    create: { code: "SHIBUYA001", name: "サンプル商業施設 渋谷店", email: "shibuya@example.com", prefecture: "東京都", city: "渋谷区", addressLine1: "渋谷2-3-4", industry: "商業施設", status: "active" },
  });
  const facility3 = await prisma.facility.upsert({
    where: { code: "YOKOHAMA001" },
    update: {},
    create: { code: "YOKOHAMA001", name: "サンプル百貨店 横浜店", email: "yokohama@example.com", prefecture: "神奈川県", city: "横浜市西区", addressLine1: "高島1-2-3", industry: "百貨店", status: "active" },
  });

  const facilities = [
    { f: facility1, cities: CITIES_GINZA,   baseUsage: 420 },
    { f: facility2, cities: CITIES_SHIBUYA, baseUsage: 340 },
    { f: facility3, cities: CITIES_YOKOHAMA, baseUsage: 280 },
  ];

  // ---- Users ----
  const passwordHash = await bcrypt.hash("Password123!", 12);
  await prisma.facilityUser.upsert({ where: { email: "admin@beautyspot.example" }, update: {}, create: { facilityId: null, role: "platform_admin", email: "admin@beautyspot.example", passwordHash, name: "管理者", isActive: true } });
  await prisma.facilityUser.upsert({ where: { email: "ginza@example.com" }, update: {}, create: { facilityId: facility1.id, role: "facility_viewer", email: "ginza@example.com", passwordHash, name: "銀座店担当", isActive: true } });
  await prisma.facilityUser.upsert({ where: { email: "shibuya@example.com" }, update: {}, create: { facilityId: facility2.id, role: "facility_viewer", email: "shibuya@example.com", passwordHash, name: "渋谷店担当", isActive: true } });
  await prisma.facilityUser.upsert({ where: { email: "yokohama@example.com" }, update: {}, create: { facilityId: facility3.id, role: "facility_viewer", email: "yokohama@example.com", passwordHash, name: "横浜店担当", isActive: true } });

  // ---- Email settings ----
  await prisma.emailSetting.upsert({ where: { key: "inquiry_auto_reply" }, update: {}, create: { key: "inquiry_auto_reply", subject: "Beauty Spotへのお問い合わせありがとうございます", bodyText: "この度はお問い合わせありがとうございます。以下より資料をご確認ください。", materialDownloadUrl: "https://example.com/material.pdf" } });
  await prisma.emailSetting.upsert({ where: { key: "contract_application_admin_notification" }, update: {}, create: { key: "contract_application_admin_notification", subject: "【Beauty Spot】新規契約申込", bodyText: "新規契約申込がありました。管理画面から確認してください。" } });

  // ---- Inquiries ----
  const inquiryData = [
    { companyName: "テスト百貨店株式会社", contactName: "山田太郎", email: "yamada@test-dept.example", facilityName: "テスト百貨店 本店", status: "new" },
    { companyName: "サンプル商業施設株式会社", contactName: "鈴木花子", email: "suzuki@sample-mall.example", facilityName: "サンプルモール 渋谷", status: "contacted" },
    { companyName: "都市開発株式会社", contactName: "佐藤一郎", email: "sato@urban-dev.example", facilityName: "アーバンプラザ新宿", status: "new" },
    { companyName: "グランドデパート株式会社", contactName: "田中美咲", email: "tanaka@grand-dept.example", facilityName: "グランドデパート 横浜", status: "qualified" },
    { companyName: "プレミアムモール運営株式会社", contactName: "高橋健太", email: "takahashi@premium-mall.example", facilityName: "プレミアムモール 品川", status: "new" },
  ];
  await prisma.inquiry.createMany({ skipDuplicates: true, data: inquiryData });

  // ---- Contract Applications ----
  const now = new Date();
  const contractData = [
    { companyName: "エレガンス百貨店株式会社", contactName: "中村真理", email: "nakamura@elegance.example", facilityName: "エレガンス百貨店 表参道", status: "submitted", agreedTermsAt: now, agreedPrivacyAt: now },
    { companyName: "シティモール運営株式会社", contactName: "小林由美", email: "kobayashi@citymall.example", facilityName: "シティモール 池袋", status: "reviewing", agreedTermsAt: now, agreedPrivacyAt: now },
  ];
  await prisma.contractApplication.createMany({ skipDuplicates: true, data: contractData });

  // ---- Metrics per facility (12 months: 2025/7 ~ 2026/3) ----
  const metricMonths = [
    { year: 2025, month: 7 }, { year: 2025, month: 8 }, { year: 2025, month: 9 },
    { year: 2025, month: 10 }, { year: 2025, month: 11 }, { year: 2025, month: 12 },
    { year: 2026, month: 1 }, { year: 2026, month: 2 }, { year: 2026, month: 3 },
  ];

  for (const { f, cities, baseUsage } of facilities) {
    console.log(`  Seeding metrics for ${f.name}...`);

    let cumulativeUsage = 0;
    let cumulativeUnique = 0;
    let cumulativeNew = 0;
    let cumulativeRepeat = 0;

    for (let mi = 0; mi < metricMonths.length; mi++) {
      const { year, month } = metricMonths[mi];
      // gradual growth
      const growth = 1 + mi * 0.06;
      const usageCount = Math.floor(baseUsage * growth) + rand(-20, 20);
      const uniqueUserCount = Math.floor(usageCount * (0.7 + Math.random() * 0.1));
      const newUserCount = Math.floor(uniqueUserCount * (0.35 + Math.random() * 0.15));
      const repeatUserCount = uniqueUserCount - newUserCount;
      const repeatRate = pct(repeatUserCount, uniqueUserCount);
      const newRate = pct(newUserCount, uniqueUserCount);
      const avgUsesPerUser = Number((usageCount / uniqueUserCount).toFixed(2));
      const avgInterval = Number((16 + Math.random() * 8).toFixed(1));
      const contRate = Number((35 + Math.random() * 15).toFixed(1));
      const medianDays = Number((18 + Math.random() * 14).toFixed(1));

      cumulativeUsage += usageCount;
      cumulativeUnique += uniqueUserCount;
      cumulativeNew += newUserCount;
      cumulativeRepeat += repeatUserCount;

      // Monthly metric
      await prisma.facilityMonthlyMetric.upsert({
        where: { facilityId_metricYear_metricMonth: { facilityId: f.id, metricYear: year, metricMonth: month } },
        update: { usageCount, uniqueUserCount, newUserCount, repeatUserCount, repeatRate, newRate, avgUsesPerUser, averageUsageIntervalDays: avgInterval, repeatContinuationRate: contRate, secondUseMedianDays: medianDays },
        create: { facilityId: f.id, metricYear: year, metricMonth: month, usageCount, uniqueUserCount, newUserCount, repeatUserCount, repeatRate, newRate, avgUsesPerUser, averageUsageIntervalDays: avgInterval, repeatContinuationRate: contRate, secondUseMedianDays: medianDays },
      });

      // Monthly dimension metrics
      const dimConfigs: { type: string; labels: string[]; weights: number[] }[] = [
        { type: "age_bucket", labels: AGE_BUCKETS, weights: AGE_WEIGHTS },
        { type: "visit_purpose", labels: PURPOSES, weights: PURPOSE_W },
        { type: "usage_trigger", labels: TRIGGERS, weights: TRIGGER_W },
        { type: "weekday", labels: WEEKDAYS, weights: WEEKDAY_W },
        { type: "hour_of_day", labels: HOURS, weights: HOUR_W },
        { type: "city", labels: cities, weights: CITY_W },
      ];

      for (const dim of dimConfigs) {
        const counts = distribute(usageCount, dim.weights);
        const total = counts.reduce((a, b) => a + b, 0);
        for (let i = 0; i < dim.labels.length; i++) {
          await prisma.facilityMonthlyDimensionMetric.upsert({
            where: { facilityId_metricYear_metricMonth_dimensionType_dimensionValue: { facilityId: f.id, metricYear: year, metricMonth: month, dimensionType: dim.type, dimensionValue: dim.labels[i] } },
            update: { usageCount: counts[i], uniqueUserCount: Math.floor(counts[i] * 0.8), percentage: pct(counts[i], total) },
            create: { facilityId: f.id, metricYear: year, metricMonth: month, dimensionType: dim.type, dimensionValue: dim.labels[i], usageCount: counts[i], uniqueUserCount: Math.floor(counts[i] * 0.8), percentage: pct(counts[i], total) },
          });
        }
      }

      // Daily metrics (last 30 days for the most recent month)
      if (mi === metricMonths.length - 1) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const dayUsage = Math.floor(usageCount / daysInMonth) + rand(-5, 5);
          const dayUnique = Math.floor(dayUsage * 0.78);
          const dayNew = Math.floor(dayUnique * 0.4);
          const dayRepeat = dayUnique - dayNew;
          await prisma.facilityDailyMetric.upsert({
            where: { facilityId_metricDate: { facilityId: f.id, metricDate: new Date(year, month - 1, d) } },
            update: { usageCount: dayUsage, uniqueUserCount: dayUnique, newUserCount: dayNew, repeatUserCount: dayRepeat, repeatRate: pct(dayRepeat, dayUnique), newRate: pct(dayNew, dayUnique) },
            create: { facilityId: f.id, metricDate: new Date(year, month - 1, d), usageCount: dayUsage, uniqueUserCount: dayUnique, newUserCount: dayNew, repeatUserCount: dayRepeat, repeatRate: pct(dayRepeat, dayUnique), newRate: pct(dayNew, dayUnique) },
          });
        }
      }
    }

    // ---- Yearly metrics (2025, 2026) ----
    for (const year of [2025, 2026]) {
      const monthlyForYear = await prisma.facilityMonthlyMetric.findMany({ where: { facilityId: f.id, metricYear: year } });
      if (monthlyForYear.length === 0) continue;
      const yUsage = monthlyForYear.reduce((s, m) => s + m.usageCount, 0);
      const yUnique = monthlyForYear.reduce((s, m) => s + m.uniqueUserCount, 0);
      const yNew = monthlyForYear.reduce((s, m) => s + m.newUserCount, 0);
      const yRepeat = monthlyForYear.reduce((s, m) => s + m.repeatUserCount, 0);
      await prisma.facilityYearlyMetric.upsert({
        where: { facilityId_metricYear: { facilityId: f.id, metricYear: year } },
        update: { usageCount: yUsage, uniqueUserCount: yUnique, newUserCount: yNew, repeatUserCount: yRepeat, repeatRate: pct(yRepeat, yUnique), newRate: pct(yNew, yUnique), avgUsesPerUser: Number((yUsage / yUnique).toFixed(2)) },
        create: { facilityId: f.id, metricYear: year, usageCount: yUsage, uniqueUserCount: yUnique, newUserCount: yNew, repeatUserCount: yRepeat, repeatRate: pct(yRepeat, yUnique), newRate: pct(yNew, yUnique), avgUsesPerUser: Number((yUsage / yUnique).toFixed(2)), averageUsageIntervalDays: Number((17 + Math.random() * 6).toFixed(1)), repeatContinuationRate: Number((38 + Math.random() * 10).toFixed(1)), secondUseMedianDays: Number((20 + Math.random() * 10).toFixed(1)) },
      });

      // Yearly dimension metrics (aggregate from monthly)
      const monthlyDims = await prisma.facilityMonthlyDimensionMetric.findMany({ where: { facilityId: f.id, metricYear: year } });
      const dimMap: Record<string, Record<string, { count: number; users: number }>> = {};
      for (const md of monthlyDims) {
        if (!dimMap[md.dimensionType]) dimMap[md.dimensionType] = {};
        if (!dimMap[md.dimensionType][md.dimensionValue]) dimMap[md.dimensionType][md.dimensionValue] = { count: 0, users: 0 };
        dimMap[md.dimensionType][md.dimensionValue].count += md.usageCount;
        dimMap[md.dimensionType][md.dimensionValue].users += md.uniqueUserCount;
      }
      for (const [dimType, values] of Object.entries(dimMap)) {
        const totalCount = Object.values(values).reduce((s, v) => s + v.count, 0);
        for (const [dimValue, data] of Object.entries(values)) {
          await prisma.facilityYearlyDimensionMetric.upsert({
            where: { facilityId_metricYear_dimensionType_dimensionValue: { facilityId: f.id, metricYear: year, dimensionType: dimType, dimensionValue: dimValue } },
            update: { usageCount: data.count, uniqueUserCount: data.users, percentage: pct(data.count, totalCount) },
            create: { facilityId: f.id, metricYear: year, dimensionType: dimType, dimensionValue: dimValue, usageCount: data.count, uniqueUserCount: data.users, percentage: pct(data.count, totalCount) },
          });
        }
      }
    }

    // ---- Cumulative metrics ----
    const cumRepeatRate = pct(cumulativeRepeat, cumulativeUnique);
    const cumNewRate = pct(cumulativeNew, cumulativeUnique);
    const cumAvgUses = Number((cumulativeUsage / cumulativeUnique).toFixed(2));
    await prisma.facilityCumulativeMetric.upsert({
      where: { facilityId: f.id },
      update: { usageCount: cumulativeUsage, uniqueUserCount: cumulativeUnique, newUserCount: cumulativeNew, repeatUserCount: cumulativeRepeat, repeatRate: cumRepeatRate, newRate: cumNewRate, avgUsesPerUser: cumAvgUses, averageUsageIntervalDays: Number((18 + Math.random() * 5).toFixed(1)), repeatContinuationRate: Number((40 + Math.random() * 8).toFixed(1)), secondUseMedianDays: Number((22 + Math.random() * 8).toFixed(1)) },
      create: { facilityId: f.id, usageCount: cumulativeUsage, uniqueUserCount: cumulativeUnique, newUserCount: cumulativeNew, repeatUserCount: cumulativeRepeat, repeatRate: cumRepeatRate, newRate: cumNewRate, avgUsesPerUser: cumAvgUses, averageUsageIntervalDays: Number((18 + Math.random() * 5).toFixed(1)), repeatContinuationRate: Number((40 + Math.random() * 8).toFixed(1)), secondUseMedianDays: Number((22 + Math.random() * 8).toFixed(1)) },
    });

    // Cumulative dimension metrics (all standard dimensions + repeat/lag)
    const allMonthlyDims = await prisma.facilityMonthlyDimensionMetric.findMany({ where: { facilityId: f.id } });
    const cumDimMap: Record<string, Record<string, { count: number; users: number }>> = {};
    for (const md of allMonthlyDims) {
      if (!cumDimMap[md.dimensionType]) cumDimMap[md.dimensionType] = {};
      if (!cumDimMap[md.dimensionType][md.dimensionValue]) cumDimMap[md.dimensionType][md.dimensionValue] = { count: 0, users: 0 };
      cumDimMap[md.dimensionType][md.dimensionValue].count += md.usageCount;
      cumDimMap[md.dimensionType][md.dimensionValue].users += md.uniqueUserCount;
    }
    for (const [dimType, values] of Object.entries(cumDimMap)) {
      const totalCount = Object.values(values).reduce((s, v) => s + v.count, 0);
      for (const [dimValue, data] of Object.entries(values)) {
        await prisma.facilityCumulativeDimensionMetric.upsert({
          where: { facilityId_dimensionType_dimensionValue: { facilityId: f.id, dimensionType: dimType, dimensionValue: dimValue } },
          update: { usageCount: data.count, uniqueUserCount: data.users, percentage: pct(data.count, totalCount) },
          create: { facilityId: f.id, dimensionType: dimType, dimensionValue: dimValue, usageCount: data.count, uniqueUserCount: data.users, percentage: pct(data.count, totalCount) },
        });
      }
    }

    // Repeat frequency buckets (cumulative only)
    const freqCounts = distribute(cumulativeUnique, REPEAT_FREQ_W);
    const freqTotal = freqCounts.reduce((a, b) => a + b, 0);
    for (let i = 0; i < REPEAT_FREQ.length; i++) {
      await prisma.facilityCumulativeDimensionMetric.upsert({
        where: { facilityId_dimensionType_dimensionValue: { facilityId: f.id, dimensionType: "repeat_frequency_bucket", dimensionValue: REPEAT_FREQ[i] } },
        update: { usageCount: freqCounts[i], uniqueUserCount: freqCounts[i], percentage: pct(freqCounts[i], freqTotal) },
        create: { facilityId: f.id, dimensionType: "repeat_frequency_bucket", dimensionValue: REPEAT_FREQ[i], usageCount: freqCounts[i], uniqueUserCount: freqCounts[i], percentage: pct(freqCounts[i], freqTotal) },
      });
    }

    // Second-use lag buckets (cumulative only)
    const lagCounts = distribute(cumulativeUnique, LAG_W);
    const lagTotal = lagCounts.reduce((a, b) => a + b, 0);
    for (let i = 0; i < LAG_BUCKETS.length; i++) {
      await prisma.facilityCumulativeDimensionMetric.upsert({
        where: { facilityId_dimensionType_dimensionValue: { facilityId: f.id, dimensionType: "second_use_lag_bucket", dimensionValue: LAG_BUCKETS[i] } },
        update: { usageCount: lagCounts[i], uniqueUserCount: lagCounts[i], percentage: pct(lagCounts[i], lagTotal) },
        create: { facilityId: f.id, dimensionType: "second_use_lag_bucket", dimensionValue: LAG_BUCKETS[i], usageCount: lagCounts[i], uniqueUserCount: lagCounts[i], percentage: pct(lagCounts[i], lagTotal) },
      });
    }

    console.log(`  ✓ ${f.name}: ${cumulativeUsage} total sessions across ${metricMonths.length} months`);
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

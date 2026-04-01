import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pct(part: number, total: number) { return total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0; }
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.max(1, Math.floor((w / sum) * total) + rand(-3, 3)));
}

async function main() {
  const facilities = await prisma.facility.findMany({ where: { status: "active", deletedAt: null } });
  const citiesMap: Record<string, string[]> = {
    GINZA001: ["東京都中央区","東京都渋谷区","東京都港区","神奈川県横浜市","東京都新宿区","東京都品川区","千葉県船橋市","埼玉県さいたま市","東京都豊島区","東京都世田谷区"],
    SHIBUYA001: ["東京都渋谷区","東京都世田谷区","東京都目黒区","東京都新宿区","東京都港区","神奈川県川崎市","神奈川県横浜市","東京都杉並区","東京都中野区","埼玉県さいたま市"],
    YOKOHAMA001: ["神奈川県横浜市","神奈川県川崎市","東京都品川区","東京都大田区","神奈川県藤沢市","神奈川県鎌倉市","東京都渋谷区","神奈川県相模原市","静岡県熱海市","千葉県千葉市"],
  };
  const baseMap: Record<string, number> = { GINZA001: 520, SHIBUYA001: 430, YOKOHAMA001: 360 };
  const year = 2026, month = 4;

  for (const f of facilities) {
    const base = baseMap[f.code] || 400;
    const usageCount = base + rand(-20, 30);
    const uniqueUserCount = Math.floor(usageCount * 0.76);
    const newUserCount = Math.floor(uniqueUserCount * 0.42);
    const repeatUserCount = uniqueUserCount - newUserCount;

    await prisma.facilityMonthlyMetric.upsert({
      where: { facilityId_metricYear_metricMonth: { facilityId: f.id, metricYear: year, metricMonth: month } },
      update: { usageCount, uniqueUserCount, newUserCount, repeatUserCount, repeatRate: pct(repeatUserCount, uniqueUserCount), newRate: pct(newUserCount, uniqueUserCount), avgUsesPerUser: Number((usageCount / uniqueUserCount).toFixed(2)), averageUsageIntervalDays: Number((17 + Math.random() * 6).toFixed(1)), repeatContinuationRate: Number((40 + Math.random() * 10).toFixed(1)), secondUseMedianDays: Number((20 + Math.random() * 8).toFixed(1)) },
      create: { facilityId: f.id, metricYear: year, metricMonth: month, usageCount, uniqueUserCount, newUserCount, repeatUserCount, repeatRate: pct(repeatUserCount, uniqueUserCount), newRate: pct(newUserCount, uniqueUserCount), avgUsesPerUser: Number((usageCount / uniqueUserCount).toFixed(2)), averageUsageIntervalDays: Number((17 + Math.random() * 6).toFixed(1)), repeatContinuationRate: Number((40 + Math.random() * 10).toFixed(1)), secondUseMedianDays: Number((20 + Math.random() * 8).toFixed(1)) },
    });

    const dims = [
      { type: "age_bucket", labels: ["under_20","age_20_24","age_25_29","age_30_34","age_35_39","age_40_49","age_50_plus"], weights: [5,28,25,18,12,8,4] },
      { type: "visit_purpose", labels: ["shopping","dining","work_commute","event","meeting","other"], weights: [42,18,14,12,8,6] },
      { type: "usage_trigger", labels: ["rain_humidity","before_date","before_after_work","just_refresh","sweat","wind","before_event","before_photo","other"], weights: [24,16,14,13,10,8,7,5,3] },
      { type: "weekday", labels: ["月","火","水","木","金","土","日"], weights: [12,13,11,14,17,18,15] },
      { type: "hour_of_day", labels: ["9","10","11","12","13","14","15","16","17","18","19","20"], weights: [3,5,8,11,13,14,13,12,15,16,10,5] },
      { type: "city", labels: citiesMap[f.code] || citiesMap.GINZA001, weights: [22,15,12,10,9,8,7,6,6,5] },
    ];

    for (const dim of dims) {
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

    // Daily metrics for first day of April
    await prisma.facilityDailyMetric.upsert({
      where: { facilityId_metricDate: { facilityId: f.id, metricDate: new Date(2026, 3, 1) } },
      update: { usageCount: Math.floor(usageCount / 30), uniqueUserCount: Math.floor(usageCount / 30 * 0.78), newUserCount: Math.floor(usageCount / 30 * 0.35), repeatUserCount: Math.floor(usageCount / 30 * 0.43), repeatRate: 55, newRate: 45 },
      create: { facilityId: f.id, metricDate: new Date(2026, 3, 1), usageCount: Math.floor(usageCount / 30), uniqueUserCount: Math.floor(usageCount / 30 * 0.78), newUserCount: Math.floor(usageCount / 30 * 0.35), repeatUserCount: Math.floor(usageCount / 30 * 0.43), repeatRate: 55, newRate: 45 },
    });

    console.log(`✓ ${f.name}: April 2026 - ${usageCount} sessions`);
  }

  // Update yearly 2026
  for (const f of facilities) {
    const monthlyForYear = await prisma.facilityMonthlyMetric.findMany({ where: { facilityId: f.id, metricYear: 2026 } });
    const yUsage = monthlyForYear.reduce((s, m) => s + m.usageCount, 0);
    const yUnique = monthlyForYear.reduce((s, m) => s + m.uniqueUserCount, 0);
    const yNew = monthlyForYear.reduce((s, m) => s + m.newUserCount, 0);
    const yRepeat = monthlyForYear.reduce((s, m) => s + m.repeatUserCount, 0);
    await prisma.facilityYearlyMetric.upsert({
      where: { facilityId_metricYear: { facilityId: f.id, metricYear: 2026 } },
      update: { usageCount: yUsage, uniqueUserCount: yUnique, newUserCount: yNew, repeatUserCount: yRepeat, repeatRate: pct(yRepeat, yUnique), newRate: pct(yNew, yUnique), avgUsesPerUser: Number((yUsage / yUnique).toFixed(2)) },
      create: { facilityId: f.id, metricYear: 2026, usageCount: yUsage, uniqueUserCount: yUnique, newUserCount: yNew, repeatUserCount: yRepeat, repeatRate: pct(yRepeat, yUnique), newRate: pct(yNew, yUnique), avgUsesPerUser: Number((yUsage / yUnique).toFixed(2)) },
    });
  }
  console.log("April 2026 seed completed.");
}
main().catch(console.error).finally(() => prisma.$disconnect());

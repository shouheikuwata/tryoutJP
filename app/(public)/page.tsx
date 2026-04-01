import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import HeroSection from "@/components/public/hero-section";
import ProblemSection from "@/components/public/problem-section";
import BenefitsSection from "@/components/public/benefits-section";
import FacilityServicesSection from "@/components/public/facility-services-section";
import AnalyticsPreviewSection from "@/components/public/analytics-preview-section";
import SafetySection from "@/components/public/safety-section";
import InstallFlowSection from "@/components/public/install-flow-section";
import FAQSection from "@/components/public/faq-section";
import CTAButton from "@/components/common/cta-button";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <FacilityServicesSection />
        <AnalyticsPreviewSection />
        <SafetySection />
        <InstallFlowSection />
        <FAQSection />

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-pink-100 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <h2 className="text-2xl font-bold md:text-3xl">まずはお気軽にご相談ください</h2>
            <p className="mt-4 text-muted-foreground">
              商業施設の「体験」と「データ活用」について、貴施設に最適なプランをご提案いたします。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <CTAButton href="/inquiry">お問い合わせ</CTAButton>
              <CTAButton href="/contract-application" variant="outline">導入のご相談</CTAButton>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary/60">ABOUT US</p>
            <h2 className="mt-2 text-2xl font-bold">TRYOUT japan agency（株）</h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              商業施設の付加価値向上には、単なる「買い物の場」から「体験の場」への転換が不可欠です。
              滞在時間を延ばす空間づくり、SNS映えする装飾、テナント連携による相互送客、
              そして体験型イベントとデータ活用による会員の囲い込み。
              私たちは施設と一緒に考え、体験サービスの企画から導入、データ分析、
              会員向けパーソナライズドサービスの設計まで一気通貫でサポートする会社です。
            </p>
            <div className="mt-8 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80"
                alt="オフィスイメージ"
                width={1000}
                height={400}
                className="h-56 w-full object-cover md:h-72"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

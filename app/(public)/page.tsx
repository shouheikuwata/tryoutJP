import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import HeroSection from "@/components/public/hero-section";
import ProblemSection from "@/components/public/problem-section";
import BenefitsSection from "@/components/public/benefits-section";
import AnalyticsPreviewSection from "@/components/public/analytics-preview-section";
import SafetySection from "@/components/public/safety-section";
import InstallFlowSection from "@/components/public/install-flow-section";
import FAQSection from "@/components/public/faq-section";
import CTAButton from "@/components/common/cta-button";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <AnalyticsPreviewSection />
        <SafetySection />
        <InstallFlowSection />
        <FAQSection />

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/40 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <h2 className="text-2xl font-bold md:text-3xl">まずはお気軽にご相談ください</h2>
            <p className="mt-4 text-muted-foreground">
              導入に関するご質問やお見積もりなど、お気軽にお問い合わせください。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <CTAButton href="/inquiry">お問い合わせ</CTAButton>
              <CTAButton href="/contract-application" variant="outline">契約申込</CTAButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

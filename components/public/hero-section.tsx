import CTAButton from "@/components/common/cta-button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4a1a25] via-[#5e2230] to-[#4a1a25] text-white">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-28 lg:px-8 lg:py-36">
        <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-white/60">TRYOUT JAPAN AGENCY</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          商業施設を
          <br />
          <span className="text-white/90">「体験の場」</span>へ
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          買い物だけの場所から、来館者が過ごしたくなる空間へ。
          体験型サービスの導入と利用データの分析で、
          施設の付加価値向上を実現します。
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CTAButton href="/inquiry" variant="primary-light">お問い合わせ</CTAButton>
          <CTAButton href="/contract-application" variant="outline-light">導入のご相談</CTAButton>
        </div>
      </div>
    </section>
  );
}

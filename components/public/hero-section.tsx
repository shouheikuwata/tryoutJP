import CTAButton from "@/components/common/cta-button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-secondary/30 to-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-widest text-primary/70">BEAUTY SPOT</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            施設の化粧室を、
            <br />
            新しい顧客体験の接点に
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            百貨店・商業施設の化粧室やパウダースペースに、無料ヘアアイロンを設置。
            施設価値の向上と来店データ分析を同時に実現します。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <CTAButton href="/inquiry">お問い合わせ</CTAButton>
            <CTAButton href="/contract-application" variant="outline">契約申込</CTAButton>
          </div>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5" />
      <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-primary/5" />
    </section>
  );
}

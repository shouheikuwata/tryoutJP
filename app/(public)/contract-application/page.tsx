import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ContractApplicationForm from "@/components/public/contract-application-form";

export default function ContractApplicationPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold">契約申込</h1>
        <p className="mb-8 text-muted-foreground">Beauty Spotの導入契約のお申込みを承ります。</p>
        <ContractApplicationForm />
      </main>
      <Footer />
    </>
  );
}

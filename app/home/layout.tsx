import Footer from "@/components/layout/footer";
import MenuLeft from "@/components/layout/menu-left";
import { Navbar } from "@/components/layout/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex relative w-full h-full overflow-hidden">
      <MenuLeft />
      <div className="w-full max-h-screen overflow-y-auto inline-block text-center justify-center">
        <Navbar />
        {children}
        <Footer />
      </div>
    </section>
  );
}

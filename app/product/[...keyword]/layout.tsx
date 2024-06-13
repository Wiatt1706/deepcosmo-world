import { Navbar } from "@/components/layout/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      <Navbar />
      {children}
    </section>
  );
}

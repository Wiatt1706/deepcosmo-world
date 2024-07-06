import { Navbar } from "@/components/layout/navbar";
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#f5f5f5]">
      {children}
    </section>
  );
}

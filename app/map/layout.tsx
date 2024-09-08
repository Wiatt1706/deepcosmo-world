export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex relative w-full h-[100vh] overflow-hidden">
      {children}
    </section>
  );
}

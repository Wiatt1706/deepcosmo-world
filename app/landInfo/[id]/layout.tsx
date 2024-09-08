
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex relative w-full h-full overflow-hidden">
      {children}
    </section>
  );
}

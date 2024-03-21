
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      <div className="w-full inline-block text-center justify-center">
        {children}
      </div>
    </section>
  );
}

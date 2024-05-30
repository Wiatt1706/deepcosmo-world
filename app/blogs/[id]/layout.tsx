export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-[#f5f5f5]">{children}</section>;
}

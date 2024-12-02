export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="relative w-full h-full ">{children}</section>;
}

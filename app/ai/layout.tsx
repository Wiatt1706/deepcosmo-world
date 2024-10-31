export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-[#f5f5f5] min-h-screen">{children}</section>;
}

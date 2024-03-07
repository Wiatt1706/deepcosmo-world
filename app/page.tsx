import LandInfo from "@/components/land/land-info";
import AuthButtonServer from "@/components/auth-button-server";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center">
      <AuthButtonServer />
      <LandInfo />
    </section>
  );
}

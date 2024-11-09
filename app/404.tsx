import { Link } from "@nextui-org/link";
import { Navbar } from "@/components/layout/navbar";
import { LogoSvg } from "@/components/utils/icons";

export default function PageNotFound() {
  return (
    <div className="w-full p-4 text-center flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
}

export function NotFoundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full d_c_c_c">
      <div>
        <Link href="/">
          <LogoSvg width={25} height={25} />
          <span className="ml-2 text-lg font-bold">DeepCosmo</span>
        </Link>
      </div>
      {children}
    </div>
  );
}

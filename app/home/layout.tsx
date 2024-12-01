import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import PageNotFound from "../404";
import { cookies } from "next/headers";
import MenuLeft from "@/components/layout/menu-left";
import UserInfoMenu from "@/components/land/user-info-menu";
import { UserProvider } from "@/components/UserProvider";
export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return <PageNotFound />;

  return (
    <UserProvider session={session}>
      <section className="flex relative w-full h-full overflow-hidden">
        <div className="flex relative w-full h-full overflow-hidden">
          <MenuLeft>
            <UserInfoMenu session={session} />
          </MenuLeft>
          <main className="w-full max-h-screen h-full overflow-y-auto">
            {children}
          </main>
        </div>
      </section>
    </UserProvider>
  );
}

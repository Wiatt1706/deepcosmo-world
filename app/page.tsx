import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import AuthButtonServer from "@/components/auth-button-server";
import NewLand from "@/components/land/new-land";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("land_info")
    .select("*, author: profiles(*),likes(*)");

  const lands =
    data?.map((land) => ({
      ...land,
      author: Array.isArray(land.author) ? land.author[0] : land.author,
      user_has_liked_land: !!land.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: land.likes.length,
    })) ?? [];

  return (
    <section className="flex flex-col items-center justify-center">
      <AuthButtonServer />
      <NewLand />
      <Lands lands={lands} />
    </section>
  );
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import NewLand from "@/components/land/new-land";
import { Navbar } from "@/components/navbar";
import { Chip, Image } from "@nextui-org/react";
import Link from "next/link";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("land_info")
    .select("*, author: profiles(*),likes(*)");

  const lands =
    data?.map((land) => ({
      ...land,
      author: Array.isArray(land.author) ? land.author[0] : land.author,
      user_has_liked_land: !!land.likes.find(
        (like) => like.user_id === session?.user.id
      ),
      likes: land.likes.length,
    })) ?? [];

  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center justify-center">
        {/* <NewLand /> */}
        <div className="flex flex-col items-center justify-center mt-[100px] w-full max-w-[1500px] mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-10">
            Welcome to DeepCosmo Lands
          </h1>
        </div>

        <div className="text-[17px]  w-full sticky top-[48px] z-20 bg-white py-2">
          <div className="w-full max-w-[1500px] mx-auto px-8">
            <div className="font-bold w-full">By the Lands, for the Lands</div>
            <div className="flex py-2">
              <Chip className="mr-2">ALL</Chip>
              <Chip className="mr-2">PLAYERS</Chip>
              <Chip className="mr-2">CREATORS</Chip>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-[1500px] mx-auto p-8">
          <Lands lands={lands} />
        </div>
      </section>
      <footer className="w-full flex items-center justify-center py-3 border-t">
        <Link
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link>
      </footer>
    </>
  );
}

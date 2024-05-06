import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import { Chip } from "@nextui-org/react";

export default async function HomeLand() {
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
    <div className="flex flex-col items-center justify-center">
      <div className="text-[17px]  w-full sticky top-[48px] z-20 py-3 bg-white">
        <div className="w-full max-w-[1500px] mx-auto px-8">
          <div className="font-bold w-full py-2 text-left">
            By the Lands, for the Lands
          </div>
          <div className="flex py-2">
            <Chip className="mr-2">ALL</Chip>
            <Chip className="mr-2">PLAYERS</Chip>
            <Chip className="mr-2">CREATORS</Chip>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8">
        <Lands lands={lands} />
      </div>
    </div>
  );
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/layout/footer";
import { Chip } from "@nextui-org/react";

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
        <div className="flex flex-col items-center justify-center mt-[100px] w-full max-w-[1500px] mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-10">
            Welcome to DeepCosmo Lands
          </h1>
          {/* <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-[300px] object-cover"
            src={`/images/Default_3D_pixel_map_Anime_Style_simple_0 (1).jpg`}
          /> */}
        </div>

        <div className="text-[17px]  w-full sticky top-[48px] z-20 py-3 bg-white">
          <div className="w-full max-w-[1500px] mx-auto px-8">
            <div className="font-bold w-full py-2">
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
      </section>
      <Footer />
    </>
  );
}

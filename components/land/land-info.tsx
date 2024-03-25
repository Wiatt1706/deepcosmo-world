"use client";
import Link from "next/link";
import Likes from "./likes";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
export default function Lands({ lands }: { lands: LandWithAuthor[] }) {
  // const [optimisticLands, addOptimisticLand] = useOptimistic<
  //   LandWithAuthor[],
  //   LandWithAuthor
  // >(lands, (currentOptimisticLands, newLand) => {
  //   const newOptimisticLands = [...currentOptimisticLands];
  //   const index = newOptimisticLands.findIndex(
  //     (land) => land.id === newLand.id
  //   );
  //   newOptimisticLands[index] = newLand;
  //   return newOptimisticLands;
  // });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime lands")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "land_info",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <div className="w-full max-w-[1500px] gap-4 grid grid-cols-12">
      {lands.map((land) => (
        <Card
          key={land.id}
          isFooterBlurred
          className="w-full h-[300px] col-span-12  sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className=" text-white/60 uppercase font-bold">New</p>
            <h4 className=" text-white font-medium text-2xl">
              {land.land_name}
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full  -translate-y-[20px] object-cover"
            src={`/images/pixel_map_${Math.round(Math.random())}.jpg`}
          />
          <CardFooter className="absolute bg-white/90 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black">
                {land.author.name}
                {land.author.username}
              </p>
              <p className="text-black ">Get notified.</p>
            </div>

            <div>
              <Link href={`edit/${land.id}`}>
                <Button radius="full" size="sm" className="mr-2">
                  Edit
                </Button>
              </Link>
              <Link href={`/${land.id}`}>
                <Button color="primary" radius="full" size="sm">
                  GO
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

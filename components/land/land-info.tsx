"use client";
import Link from "next/link";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
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

  return lands.map((land) => (
    <div key={land.id}>
      <p>
        {land.author.name}
        {land.author.username}
      </p>
      <p>
        <Link href={`/land/${land.id}`}>{land.land_name}</Link>
      </p>
      <Likes
        land={land}
        // addOptimisticLand={addOptimisticLand}
      />
    </div>
  ));
}

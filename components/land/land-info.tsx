import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import NewLand from "./new-land";
import Likes from "./likes";

export default async function LandInfo() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("land_info")
    .select("*, profiles(*),likes(*)");

  const lands =
    data?.map((land) => ({
      ...land,
      user_has_liked_land: !!land.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: land.likes.length,
    })) ?? [];

  return (
    <ul>
      <NewLand />
      {lands?.map((land) => (
        <div key={land.id}>
          <p>
            {land?.profiles?.name}
            {land?.profiles?.username}
          </p>
          <p>
            <Link href={`/land/${land.id}`}>{land.land_name}</Link>
          </p>
          <Likes land={land} />
        </div>
      ))}
    </ul>
  );
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function LandInfo() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.from("land_info").select();

  return (
    <ul>
      {data?.map((todo) => (
        <Link key={todo.id} href={`/land/${todo.id}`}>
          {todo.id}
        </Link>
      ))}
    </ul>
  );
}

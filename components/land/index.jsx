import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function LandInfo() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

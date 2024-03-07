import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default function NewLand() {
  const addLand = async (formData: FormData) => {
    "use server";
    const landName = String(formData.get("land_name"));
    const supabase = createServerActionClient<Database>({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("land_info")
        .insert({ land_name: landName, size: [50, 50], land_owner: user.id });
    }
  };

  return (
    <form action={addLand}>
      <input name="land_name" className="bg-inherit" />
    </form>
  );
}

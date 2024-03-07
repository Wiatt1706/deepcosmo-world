"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({ land }) {
  const router = useRouter();

  const handleLike = async () => {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (land.user_has_liked_land) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, land_id: land.id });
      } else {
        await supabase.from("likes").insert({
          user_id: user.id,
          land_id: land.id,
        });
      }

      router.refresh();
    }
  };

  return (
    <Button onClick={handleLike} size="sm">
      {land.likes} likes
    </Button>
  );
}

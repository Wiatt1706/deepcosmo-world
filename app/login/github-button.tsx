"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GithubSvg } from "@/components/utils/icons";

export default function GitHubButton() {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={handleSignIn} className="hover:bg-gray-800 p-8 rounded-xl">
      <GithubSvg width={30} height={30} />
    </button>
  );
}

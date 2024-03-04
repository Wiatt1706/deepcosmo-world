import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import {
  createServerClient,
  type CookieOptions,
  serialize,
} from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and/or API key not provided.");
}

export const supabaseServerSideClient = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: false,
    },
    cookies: {
      get(name: string) {
        return context.req.cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        context.res.setHeader("Set-Cookie", serialize(name, value, options));
      },
      remove(name: string, options: CookieOptions) {
        context.res.setHeader("Set-Cookie", serialize(name, "", options));
      },
    },
  });

  return supabase;
};

export const supabaseApiClient = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabase = createServerClient<Database>(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: false,
    },
    cookies: {
      get(name: string) {
        return req.cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        res.setHeader("Set-Cookie", serialize(name, value, options));
      },
      remove(name: string, options: CookieOptions) {
        res.setHeader("Set-Cookie", serialize(name, "", options));
      },
    },
  });
  return supabase;
};

// 创建 Supabase 客户端
export default createClient<Database>(supabaseUrl, supabaseKey);

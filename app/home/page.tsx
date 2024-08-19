import React from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Lands from "@/components/land/land-info";
import { Button } from "@nextui-org/button";
import { TbPlus, TbUpload } from "react-icons/tb";
import HomeLandSearch from "@/components/land/home-land-search";
import MenuLeft from "@/components/layout/menu-left";
import Footer from "@/components/layout/footer";
import UserInfoMenu from "@/components/land/user-info-menu";

const orderByMap: { [key: string]: string } = {
  new: "created_at", // 当 sort 为 "new" 时，按照 "created_at" 字段排序
};
export default async function Home({
  searchParams,
}: {
  searchParams: any; // 此处的类型根据你的需要进行调整
}) {
  const { sort = "new", search } = searchParams; // 默认页码为 1，每页显示数量为 12

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <PageNotFound />;
  }

  const { data: userInfo } = await supabase
    .from("profiles")
    .select()
    .eq("id", session?.user.id);

  if (!userInfo || userInfo.length === 0) {
    return <PageNotFound />;
  }

  let productsQuery = supabase
    .from("land_info")
    .select("*, author: profiles(*),likes(*)");

  if (search) {
    productsQuery = productsQuery.ilike("land_name", "%" + search + "%");
  }

  const { data } = await productsQuery.order(
    orderByMap[sort] || orderByMap.featured,
    {
      ascending: false,
      nullsFirst: false,
    }
  );

  const lands =
    data?.map((land) => ({
      ...land,
      author: Array.isArray(land.author) ? land.author[0] : land.author,
      user_has_liked_land: !!land.likes.find(
        (like: any) => like.user_id === session?.user.id
      ),
      likes: land.likes.length,
    })) ?? [];


  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <MenuLeft>
        <UserInfoMenu />
      </MenuLeft>
      <div className="w-full max-h-screen h-full overflow-y-auto inline-block text-center justify-center bg-[#f3f6f8]">
        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-start w-full max-w-[1500px] px-8 pt-8">
            <HomeLandSearch />
            <h1 className="text-2xl font-bold text-left pt-8 text-[#20272c]">
              Dashboard
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8 gap-2">
            <div className="w-full flex justify-between">
              <h3 className="text-lg text-[#20272c] font-bold">
                Recently modified
              </h3>
              <div className="flex gap-1 items-center">
                <Button size="sm" variant="bordered" startContent={<TbPlus />}>
                  Creat Land
                </Button>
                <Button color="primary" size="sm" startContent={<TbUpload />}>
                  Upload Land
                </Button>
              </div>
            </div>
            <Lands lands={lands} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="w-full p-4 text-center flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link href="/" className="text-blue-500">
        Back to Home
      </Link>
    </div>
  );
}

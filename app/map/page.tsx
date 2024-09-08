import React from "react";
import ShowMapIndex from "@/components/map/layout/ShowMapIndex";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function EditInfo({
  searchParams,
}: {
  searchParams: any; // 此处的类型根据你的需要进行调整
}) {

  const { search } = searchParams; // 默认页码为 1，每页显示数量为 12
 

  const supabase = createServerComponentClient<Database>({ cookies });


  let productsQuery = supabase.from("ProductsInfo").select("*");
  if (search) {
    productsQuery = productsQuery.ilike("name", "%" + search + "%");
  }


  return <ShowMapIndex />;
}

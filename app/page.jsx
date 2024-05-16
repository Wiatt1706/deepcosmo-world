import React, { Suspense } from "react";
import Link from "next/link";
import ProductsService from "@/components/products/products-service";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Footer from "@/components/layout/footer";
import RouteLoader from "@/components/assembly/route-loader";

export default async function Home(context) {
  const { searchParams } = context; // 通过上下文对象获取路由信息

  // const supabase = createServerComponentClient({ cookies });

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session || session.length === 0) {
  //   return <PageNotFound />;
  // }

  // const { data: userInfo } = await supabase
  //   .from("profiles")
  //   .select()
  //   .eq("id", session?.user.id);

  // if (userInfo.length === 0) {
  //   return <PageNotFound />;
  // }
  return (
    <Suspense fallback={<RouteLoader />}>
      <ProductsService searchParams={searchParams} />
      <Footer />
    </Suspense>
  );
}

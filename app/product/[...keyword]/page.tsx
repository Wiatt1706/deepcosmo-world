import React, { Suspense } from "react";
import ProductsService from "@/components/products/products-service";
import RouteLoader from "@/components/assembly/route-loader";
import Footer from "@/components/layout/footer";
export default async function productKeyword({
  params,
  searchParams,
}: {
  params: { keyword: string };
  searchParams: any; // 此处的类型根据你的需要进行调整
}) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ProductsService
        paramsKeywords={params.keyword}
        searchParams={searchParams}
      />
      <Footer />
    </Suspense>
  );
}

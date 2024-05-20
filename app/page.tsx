import React, { Suspense } from "react";
import Footer from "@/components/layout/footer";
import RouteLoader from "@/components/assembly/route-loader";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProductKeyword from "@/components/products/product-keyword";
import ProductBtnGroup from "@/components/products/product-btnGroup";
import ProductInfo from "@/components/products/product-item";
import ProductPagination from "@/components/products/product-pagination";
export default async function Home({
  searchParams,
}: {
  searchParams: any; // 此处的类型根据你的需要进行调整
}) {
  const { page = 1, pageSize = 12, sort = "featured", search } = searchParams; // 默认页码为 1，每页显示数量为 12
  const startRow = (page - 1) * pageSize;
  const endRow = startRow + pageSize - 1;
  // 定义不同排序方式对应的字段
  const orderByMap: { [key: string]: string } = {
    featured: "score_num", // 默认排序方式，按照 "score_num" 字段排序
    popular: "hot_num", // 当 sort 为 "popular" 时，按照 "hot_num" 字段排序
    new: "created_at", // 当 sort 为 "new" 时，按照 "created_at" 字段排序
  };

  const supabase = createServerComponentClient<Database>({ cookies });

  // 查询总行数
  let countQuery = supabase
    .from("ProductsInfo")
    .select("count", { count: "exact" });
  if (search) {
    countQuery = countQuery.ilike("name", "%" + search + "%");
  }
  const { count } = await countQuery;

  // 使用 "exact" 选项确保返回的是确切的总行数
  const calculatedTotalPages = Math.ceil((count || 0) / pageSize);

  let productsQuery = supabase.from("ProductsInfo").select("*");
  if (search) {
    productsQuery = productsQuery.ilike("name", "%" + search + "%");
  }
  const { data: products } = await productsQuery
    .range(startRow, endRow)
    .order(orderByMap[sort] || orderByMap.featured, {
      ascending: false,
      nullsFirst: false,
    });

  const { data: keywords } = await supabase
    .from("Keyword")
    .select("*")
    .eq("label_type", "0");

  return (
    <Suspense fallback={<RouteLoader />}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-[17px] w-full sticky top-[48px] z-20 bg-white bg-opacity-80 backdrop-blur-md">
          <div className="flex py-2 justify-between items-center w-full max-w-[1500px] mx-auto px-8">
            <ProductKeyword keywords={keywords} activeKeys={[]} />
            <div className="flex justify-end">
              <ProductBtnGroup sort={sort} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8">
          <div className="w-full max-w-[1500px] gap-6 grid grid-cols-12">
            {products?.map((product: Product) => (
              <ProductInfo key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="w-full mb-8 flex justify-center items-center">
          <ProductPagination inintPage={page} total={calculatedTotalPages} />
        </div>
      </div>
      <Footer />
    </Suspense>
  );
}

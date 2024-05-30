import React, { Suspense } from "react";
import Footer from "@/components/layout/footer";
import RouteLoader from "@/components/assembly/route-loader";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProductKeyword from "@/components/assembly/keyword";
import ProductBtnGroup from "@/components/products/product-btnGroup";
import PostItem from "@/components/post/post-item";
import ProductPagination from "@/components/products/product-pagination";
import styles from "@/styles/community/Maininfo01.module.css";
export default async function communityPage({
  searchParams,
}: {
  searchParams: any; // 此处的类型根据你的需要进行调整
}) {
  const { page = 1, pageSize = 12, sort = "new", search } = searchParams; // 默认页码为 1，每页显示数量为 12
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
    .from("PxCmtyArticles")
    .select("count", { count: "exact" });
  if (search) {
    countQuery = countQuery.ilike("title", "%" + search + "%");
  }
  const { count } = await countQuery;

  // 使用 "exact" 选项确保返回的是确切的总行数
  const calculatedTotalPages = Math.ceil((count || 0) / pageSize);

  let pxCmtyArticlesQuery = supabase.from("PxCmtyArticles").select("*");
  if (search) {
    pxCmtyArticlesQuery = pxCmtyArticlesQuery.ilike(
      "title",
      "%" + search + "%"
    );
  }
  const { data: pxCmtyArticles } = await pxCmtyArticlesQuery
    .range(startRow, endRow)
    .order(orderByMap[sort] || orderByMap.new, {
      ascending: false,
      nullsFirst: false,
    });

  const { data: keywords } = await supabase
    .from("Keyword")
    .select("*");

  return (
    <Suspense fallback={<RouteLoader />}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-[17px] w-full sticky top-[48px] z-20 bg-white bg-opacity-80 backdrop-blur-md">
          <div className="flex py-2 justify-between items-center w-full  mx-auto px-8">
            <ProductKeyword keywords={keywords} activeKeys={[]} />
            <div className="flex justify-end">
              <ProductBtnGroup sort={sort} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8">
          <div className={styles.topItems}>
            {pxCmtyArticles?.map((postItem: PxCmtyArticles) => (
              <PostItem key={postItem.id} postInfo={postItem} />
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

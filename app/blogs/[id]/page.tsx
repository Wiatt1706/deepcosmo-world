import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import {
  LikeRecordService,
  RejectRecordService,
  PxCmtyArticlesService,
  KeywordService,
} from "@/utils/serviceimpl";
import BlogClient from "./blogClient";

export default async function BlogsPageService({ params }: any) {
  const postId = params?.id;

  const supabase = createServerComponentClient<Database>({ cookies });

  const pxCmtyArticles = await PxCmtyArticlesService.queryById(
    supabase,
    postId
  );
  let result = pxCmtyArticles;

  if (!result) {
    return {
      notFound: true, // 触发 Next.js 默认的 404 页面
    };
  }

  // 获取当前用户的抵制记录
  const Keyword = await KeywordService.findByIds(supabase, result.keywords);
  result = { ...result, Keyword: Keyword };

  const { data: userInfo } = await supabase.auth.getUser();

  if (userInfo) {
    const userId = userInfo.user?.id;

    // 获取当前用户的点赞记录
    const likeArray = await LikeRecordService.findPostLikeArray(
      supabase,
      userId,
      postId,
      0
    );

    // 获取当前用户的抵制记录
    const isReject = await RejectRecordService.findPostIsReject(
      supabase,
      userId,
      postId,
      0
    );

    result = { ...result, likeArray: likeArray, isReject: isReject | false };
  }

  return <BlogClient post={result} />;
}

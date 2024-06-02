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

  if (!pxCmtyArticles) {
    return {
      notFound: true, // 触发 Next.js 默认的 404 页面
    };
  }

  let resultVo: PostVO = {
    ...pxCmtyArticles,
    Keyword: null,
    likeArray: null,
    isReject: false,
  };
  // 获取当前用户的抵制记录
  if (pxCmtyArticles.keywords) {
    const Keyword = await KeywordService.findByIds(
      supabase,
      pxCmtyArticles.keywords
    );
    console.log("Keyword", Keyword);

    resultVo.Keyword = Keyword;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const userId = session.user?.id;

    console.log("session", userId);

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

    resultVo.likeArray = likeArray;
    resultVo.isReject = isReject || false;
  }

  return <BlogClient post={resultVo} session={session} />;
}

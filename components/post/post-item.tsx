"use client";
import Link from "next/link";
import styles from "@/styles/community/Maininfo01.module.css";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useKeywordStore } from "../assembly/keyword";
import Image from "next/image";
import ReactionButton from "@/components/assembly/ReactionButton";
import { MessageCircle } from "lucide-react";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL +
  "/storage/v1/object/public/deepcosmo_img/";

export default function PostItem({ postInfo }: { postInfo: PxCmtyArticles }) {
  const keywords = useKeywordStore((state: any) => state.keywords);
  const [keyswordList, setKeyswordList] = useState<Keyword[]>([]); // 设置初始值为关键词数组

  console.log(keyswordList);

  useEffect(() => {
    if (
      postInfo &&
      postInfo.keywords &&
      postInfo.keywords.length > 0 &&
      keywords?.length > 0
    ) {
      const matchingKeywords = keywords.filter((k: Keyword) =>
        postInfo.keywords?.includes(k.id)
      );
      setKeyswordList(matchingKeywords);
    }
  }, [keywords, postInfo]);

  return (
    <div className={clsx([styles.feedItemPro, styles.storyItem])}>
      <Link href={`/blogs/${postInfo.id}`} className={clsx([styles.feedItem])}>
        <div className={styles.storyTextLink}>
          <h3>{postInfo.title}</h3>
          <p>{postInfo.description}</p>
        </div>

        {postInfo.banner_img_url && (
          <div className={styles.storyImageLink}>
            <Image
              alt=""
              width={175}
              height={116}
              src={PUBLIC_URL + postInfo.banner_img_url}
            />
          </div>
        )}

        <div className={styles.storyCounts}>
          <ReactionButton post={postInfo} />
          {postInfo.comment_record_num && postInfo.comment_record_num > 0 && (
            <div className={styles.storyCount}>
              <MessageCircle className={styles.storyCountsIcon} />
              <span>{postInfo.comment_record_num}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

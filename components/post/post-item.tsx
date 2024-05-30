"use client";
import Link from "next/link";
import styles from "@/styles/community/Maininfo01.module.css";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useKeywordStore } from "../assembly/keyword";
import Image from "next/image";
import ReactionButton from "@/components/assembly/ReactionButton";
import { MessageCircle } from "lucide-react";
import { Chip } from "@nextui-org/react";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL +
  "/storage/v1/object/public/deepcosmo_img/";

export default function PostItem({ postInfo }: { postInfo: PxCmtyArticles }) {
  const keywords = useKeywordStore((state: any) => state.keywords);
  const [keyswordList, setKeyswordList] = useState<Keyword[]>([]); // 设置初始值为关键词数组

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
          <div className="flex ml-[-5px]" style={{ maxWidth: "100%" }}>
            {keyswordList.map((k: Keyword) => (
              <Chip
                key={k.id}
                size="sm"
                radius="sm"
                variant="light"
                style={{ color: k.color || "black" }}
                className="text-black cursor-pointer text-left hover:bg-gray-200"
                href={"/product/" + k.id}
                as={Link}
              >
                <span style={{ color: k.color || "black" }}># </span>
                {k.label_name}
              </Chip>
            ))}
          </div>
          <p>{postInfo.description}</p>
        </div>

        {postInfo.banner_img_url && (
          <div className={styles.storyImageLink}>
            <Image
              alt=""
              width={170}
              height={116}
              src={PUBLIC_URL + postInfo.banner_img_url}
            />
          </div>
        )}

        <div className={styles.storyCounts}>
          <ReactionButton post={postInfo} />
          {postInfo.comment_record_num > 0 && (
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

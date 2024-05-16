"use client";
import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import { SecuritySvg } from "../utils/icons";
import ScoreInput from "@/components/assembly/score-input";
import { useKeywordStore } from "./product-keyword";
import { useEffect, useState } from "react";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL +
  "/storage/v1/object/public/deepcosmo_img/products_img/";

export default function ProductInfo({ product }: { product: Product }) {
  const keywords = useKeywordStore((state: any) => state.keywords);
  const [keyswordList, setKeyswordList] = useState<Keyword[]>([]); // 设置初始值为关键词数组

  useEffect(() => {
    // 只有当 product.keywords 不为空时才进行过滤操作
    if (
      product.keywords &&
      product.keywords.length > 0 &&
      keywords &&
      keywords.length > 0
    ) {
      const matchingKeywords = keywords.filter((k: Keyword) =>
        product.keywords.includes(k.id)
      );
      setKeyswordList(matchingKeywords); // 更新关键词列表
    }
  }, [keywords, product]);

  const getPayTypeShow = () => {
    switch (product.pay_type) {
      case "1":
        return <p className="text-black">免费增值 {product.pay_text}</p>;
      case "2":
        return <p className="text-black">免费试用 {product.pay_text}</p>;
      case "3":
        return <p className="text-black">付费 {product.pay_text}</p>;
      default:
        return <p className="text-black">免费</p>;
    }
  };

  return (
    <Card
      style={{
        zIndex: 0,
      }}
      className="border shadow-none w-full col-span-12  sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
    >
      <CardHeader className="flex gap-3 pb-0">
        <div className="flex items-center justify-center w-14 h-14 text-large m-2">
          <Avatar
            isBordered
            radius="sm"
            src={PUBLIC_URL + product.icon_url}
            className="w-14 h-full"
          />
        </div>
        <div className="flex flex-col text-left w-full">
          <p className="text-black font-bold text-lg">{product.name}</p>
          {getPayTypeShow()}
        </div>
        <div className="flex items-left w-14 h-14 text-large">
          <SecuritySvg />
        </div>
      </CardHeader>
      <CardBody className="mb-14">
        <div className="flex gap-4 px-2">
          <p className="text-black">{product.description}</p>
        </div>
        <div className="flex flex-wrap " style={{ maxWidth: "100%" }}>
          {keyswordList.map((k: Keyword) => (
            <Chip
              key={k.id}
              variant="light"
              style={{ color: k.color || "black" }}
              className="text-black"
              href={"/product/" + k.id}
              as={Link}
            >
              #{k.label_name}
            </Chip>
          ))}
        </div>
      </CardBody>

      <CardFooter className="absolute bg-white/90 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <ScoreInput score={product.score_num} />
        <div>
          <Link href={`${product.web_url}`} target="_blank">
            <Button color="primary" radius="full" size="sm">
              访问
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

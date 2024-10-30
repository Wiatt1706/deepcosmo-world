"use client";

import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { locatePosAtom } from "../../store/ShowBaseAtomStore";

export default function LocateBtn({
  children,
  pixelBlock,
}: {
  children: React.ReactNode;
  pixelBlock: any;
}) {
  const router = useRouter();
  const setLocatePos = useSetAtom(locatePosAtom);
  const handleClick = () => {
    const newX = pixelBlock.x;
    const newY = pixelBlock.y;

    // 判断 parentLandId 是否为空
    const newUrl = pixelBlock.parentLandId
      ? `/map/${pixelBlock.parentLandId}?zoom=5&x=${newX}&y=${newY}`
      : `/map?zoom=5&x=${newX}&y=${newY}`;

    // 使用 Next.js 的 router 进行导航
    router.push(newUrl);
    setLocatePos({
      x: newX + pixelBlock.width / 2,
      y: newY + pixelBlock.height / 2,
    });
  };

  return <div onClick={handleClick}>{children}</div>;
}

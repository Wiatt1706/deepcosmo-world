"use client";

import styles from "@/styles/canvas/ViewLeftInfo.module.css";
import { Button } from "@nextui-org/react";
import { clsx } from "clsx";
import { TbX } from "react-icons/tb";
import { useShowBaseStore } from "./ShowMapIndex";

export default function LeftInfoView({ setIsAct }: { setIsAct: any }) {
  const [selectedPixelBlock] = useShowBaseStore((state: any) => [
    state.selectedPixelBlock,
  ]);

  if (!selectedPixelBlock) return null;
  return (
    <div className={styles["act-view"] + " m-4 rounded shadow border"}>
      <div className={styles["columnGgroup"] + " border-b"}>
        <div className={styles["col-title"]}>
          <h2 className={clsx([styles["col"], styles["title"]])}>
            #
            {selectedPixelBlock?.name ??
              `Land_${selectedPixelBlock.x}_${selectedPixelBlock.y}`}
          </h2>
          <Button
            variant="light"
            isIconOnly
            endContent={<TbX size={20} />}
            className="text-[#63727E]"
            size="sm"
            onClick={() => setIsAct(false)}
          />
        </div>
      </div>
      <div className={clsx([styles["col-group"]])}>
        <div className={styles["columnGgroup"]}></div>
      </div>
    </div>
  );
}

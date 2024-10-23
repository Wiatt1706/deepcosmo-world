"use client";

import styles from "@/styles/canvas/ViewLeftInfo.module.css";
import { Button } from "@nextui-org/react";
import { clsx } from "clsx";
import { TbX } from "react-icons/tb";
import { useQueryPixelBlockByColumn } from "@/components/hook/service/useQueryPixelBlock";
import { useEffect, useState } from "react";
import { selectedPixelBlockAtom } from "../store/ShowBaseAtomStore";
import { useAtomValue } from "jotai";

export default function LeftInfoView() {
  console.log("LeftInfoView");

  const [isLeftInfoAct, setIsLeftInfoAct] = useState<boolean>(false);

  const selectedPixelBlock = useAtomValue(selectedPixelBlockAtom);

  useEffect(() => {
    if (selectedPixelBlock) {
      setIsLeftInfoAct(true);
    }
  }, [selectedPixelBlock]);

  useEffect(() => {
    if (selectedPixelBlock) {
      setIsLeftInfoAct(true);
    } else {
      setIsLeftInfoAct(false);
    }
  }, [selectedPixelBlock]);

  // const { pixelBlocks, loading, error } = useQueryPixelBlockByColumn({
  //   column: "id",
  //   value: pixelId,
  // });

  // console.log("pixelBlocks", pixelBlocks);

  return (
    <div
      className={clsx(
        styles["act-view"],
        "m-4 rounded shadow border",
        isLeftInfoAct ? "block" : "hidden"
      )}
    >
      <div className={styles["columnGgroup"] + " border-b"}>
        <div className={styles["col-title"]}>
          <h2 className={clsx([styles["col"], styles["title"]])}>
            #
            {/* {selectedPixelBlock?.name ??
              `Land_${selectedPixelBlock.x}_${selectedPixelBlock.y}`} */}
          </h2>
          <Button
            variant="light"
            isIconOnly
            endContent={<TbX size={20} />}
            className="text-[#63727E]"
            size="sm"
            onClick={() => setIsLeftInfoAct(false)}
          />
        </div>
      </div>
      <div className={clsx([styles["col-group"]])}>
        <div className={styles["columnGgroup"]}></div>
      </div>
    </div>
  );
}

"use client";
import styles from "@/styles/canvas/ViewRightTool.module.css";
import { Button, ChipProps, Image } from "@nextui-org/react";
import { clsx } from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TbCaretDownFilled, TbEdit, TbX } from "react-icons/tb";
import {
  OPTION_TEST_LIST4,
  OPTION_TEST_LIST5,
  PixelBlock,
} from "@/types/MapTypes";
import DateComponent from "@/components/utils/DateComponent";

export default function RightInfoView({
  setIsRightAct,
}: {
  setIsRightAct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={styles["rightInfoView"]}>
      <div className={styles["titleGroup"]}>
        <h4 className={clsx([styles["col"], styles["title"]])}>
          TestWorld Infomation
        </h4>
        <Button
          variant="light"
          isIconOnly
          endContent={<TbX size={20} />}
          className="text-[#63727E]"
          size="sm"
          onClick={() => setIsRightAct(false)}
        />
      </div>

      <div className={styles["rightInfoContent"] + " flex flex-col gap-2"}>
        <div className="flex items-center justify-between w-full my-2">
          <div className="min-w-[90px] min-h-[90px] border border rounded-[8px] hover:border-[#006fef] p-[2px]">
            <Image
              width={90}
              radius="sm"
              alt="NextUI hero Image"
              src="https://3-map.sandbox.game/beta/3/0/-6"
            />
          </div>
          <div className="flex flex-col ml-4 justify-end align-center w-full text-sm">
            <div className="h-[35px] font-bold flex items-center justify-between">
              <span className="text-[#3d4853]">TestWorld</span>
              <Button
                variant="light"
                isIconOnly
                endContent={<TbEdit size={18} />}
                className="text-[#63727E]"
                size="sm"
                onClick={() => setIsRightAct(false)}
              />
            </div>
            <div className="h-[55px] text-[#63727E] text-[12px]">
              I gather the world's every scene, just to heal you
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <h4 className={clsx([styles["col"], styles["col-title"]])}>
            现存数据
            <TbCaretDownFilled size={18} className="ml-2" />
          </h4>

          <div className="flex items-center justify-between">
            <span className="text-sm">世界坐标</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              0, 0
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">级别</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              3x3
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">类型</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              里土地
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">容量大小</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              100 x 100
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">使用像素块</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              841
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">持有者</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              Wiatt
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">创建时间</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              <DateComponent dateString={"2022-01-01"} label="" />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <h4 className={clsx([styles["col"], styles["col-title"]])}>
            Colors（5）
            <TbCaretDownFilled size={18} className="ml-2" />
          </h4>

          {OPTION_TEST_LIST4.map((item) => (
            <div key={item.value} className="flex items-center justify-between">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: item.color }}
              />
              <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <h4 className={clsx([styles["col"], styles["col-title"]])}>
            Group（5）
            <TbCaretDownFilled size={18} className="ml-2" />
          </h4>

          {OPTION_TEST_LIST5.map((item) => (
            <div key={item.value} className="flex items-center justify-between">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: item.color }}
              />
              <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

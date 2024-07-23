// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { Link, RadioGroup, cn } from "@nextui-org/react";
import { TbHome, TbMapPin, TbRefresh, TbSearch } from "react-icons/tb";
import algorithm, { TerrainType } from "../helpers/algorithm";
import { PixelBlock } from "@/types/MapTypes";
import { useEditMapStore } from "../SocketManager";
import { NumInput } from "@/components/utils/NumInput";
import { CustomRadio } from "@/components/utils/CustomRadio";
import { ColorPicker } from "@/components/utils/ColorPicker";
import { LogoSvg } from "@/components/utils/icons";

export default function LeftToolView() {
  const [toolInfo, setToolInfo, pixelBlocks, setPixelBlocks, initData] =
    useEditMapStore((state: any) => [
      state.toolInfo,
      state.setToolInfo,
      state.pixelBlocks,
      state.setPixelBlocks,
      state.initData,
    ]);

  return (
    <div className={styles["left-view"] + " shadow"}>
      <div className={styles["left-tool-log"]}>
        <Link href="/">
          <LogoSvg size={32} />
        </Link>
      </div>
      <div className="flex flex-col gap-3 justify-center align-center mt-3">
        <div className={styles["left-tool-box"]}>
          <TbSearch size={24} strokeWidth={1.3} />
        </div>
        <div className={styles["left-tool-box"]}>
          <TbHome size={24} strokeWidth={1.3} />
        </div>
        <div className={styles["left-tool-box"]}>
          <TbMapPin size={24} strokeWidth={1.3} />
        </div>
      </div>
    </div>
  );
}

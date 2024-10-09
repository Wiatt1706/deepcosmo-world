// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftMenu.module.css";
import { Link } from "@nextui-org/react";
import {
  TbBookmark,
  TbHistory,
} from "react-icons/tb";
import { LogoSvg } from "@/components/utils/icons";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";


export default function LeftMenuView({
  handleMenuClick,
}: {
  handleMenuClick: (module: string) => void;
}) {
  const [selectedModule] = useShowBaseStore((state: any) => [
    state.selectedModule,
  ]);

  return (
    <div className={styles["left-view"] + " shadow"}>
      <div className={styles["left-tool-log"]}>
        <Link href="/">
          <LogoSvg size={32} />
        </Link>
      </div>
      <div className="flex flex-col gap-3 justify-center align-center mt-3">
        <div
          onClick={() => handleMenuClick("Bookmark")}
          className={`${styles["left-tool-box"]} ${
            selectedModule === "Bookmark" ? styles["active"] : ""
          }`}
        >
          <TbBookmark size={24} strokeWidth={1.5} />
        </div>
        <div
          onClick={() => handleMenuClick("History")}
          className={`${styles["left-tool-box"]} ${
            selectedModule === "History" ? styles["active"] : ""
          }`}
        >
          <TbHistory size={24} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

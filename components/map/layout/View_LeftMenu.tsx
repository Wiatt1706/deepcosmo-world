// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftMenu.module.css";
import { Link } from "@nextui-org/react";
import { TbBookmark, TbHistory } from "react-icons/tb";
import { LogoSvg } from "@/components/utils/icons";
import { useShowBaseStore } from "@/components/map/layout/ShowMapIndex";

export default function LeftMenuView() {
  console.log("LeftMenuView");

  const [selectedModule, setSelectedModule, isLeftAct, setIsLeftAct] =
    useShowBaseStore((state: any) => [
      state.selectedModule,
      state.setSelectedModule,
      state.isLeftAct,
      state.setIsLeftAct,
    ]);

  const handleModuleClick = (module: string) => {
    if (isLeftAct && selectedModule === module) {
      setIsLeftAct(false);
    } else if (!isLeftAct || selectedModule !== module) {
      setIsLeftAct(true);
      setSelectedModule(module);
    }
  };

  return (
    <div className={styles["left-view"] + " shadow"}>
      <div className={styles["left-tool-log"]}>
        <Link href="/">
          <LogoSvg size={32} />
        </Link>
      </div>
      <div className="flex flex-col gap-3 justify-center align-center mt-3">
        <div
          onClick={() => handleModuleClick("Bookmark")}
          className={`${styles["left-tool-box"]} ${
            selectedModule === "Bookmark" ? styles["active"] : ""
          }`}
        >
          <TbBookmark size={24} strokeWidth={1.5} />
        </div>
        <div
          onClick={() => handleModuleClick("History")}
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

// pages/NewMapPage.tsx
"use client";
import styles from "@/styles/canvas/ViewLeftMenu.module.css";
import { Link } from "@nextui-org/react";
import { TbBookmark, TbHistory } from "react-icons/tb";
import { LogoSvg } from "@/components/utils/icons";
import { isLeftActAtom, selectedModuleAtom } from "../store/ShowBaseAtomStore";
import { useAtom, useSetAtom } from "jotai";

export default function LeftMenuView() {
  console.log("LeftMenuView");

  const [selectedModule, setSelectedModule] = useAtom(selectedModuleAtom);
  const setIsLeftAct = useSetAtom(isLeftActAtom);

  const handleModuleClick = (module: string) => {
    setIsLeftAct(true);
    setSelectedModule(module);
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

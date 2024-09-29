"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import TableTest from "./right-view-model/teabel-test";
import RightInfoView from "./right-view-model/InfoView";
import { Button } from "@nextui-org/button";
import { TbX } from "react-icons/tb";
import BookmarkView from "./left-view-model/BookmarkView";
import HistoryView from "./left-view-model/HistoryView";

export default function LeftToolView({
  setIsAct,
  selectedModule,
}: {
  setIsAct: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModule: string;
}) {
  return (
    <div className={styles["left-view"] + " shadow"}>
      {selectedModule === "Bookmark" && <BookmarkView setIsAct={setIsAct} />}
      {selectedModule === "History" && <HistoryView setIsAct={setIsAct} />}
    </div>
  );
}

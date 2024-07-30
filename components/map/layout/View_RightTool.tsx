"use client";
import styles from "@/styles/canvas/ViewRightTool.module.css";
import TableTest from "./right-view-model/teabel-test";
import RightInfoView from "./right-view-model/InfoView";

export default function RightToolView({
  setIsRightAct,
  selectedModule,
}: {
  setIsRightAct: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModule: string;
}) {
  return (
    <div className={styles["right-view"] + " shadow"}>
      {selectedModule === "table" && (
        <TableTest setIsRightAct={setIsRightAct} />
      )}
      {selectedModule === "info" && (
        <RightInfoView setIsRightAct={setIsRightAct} />
      )}
      {selectedModule === "code" && <div>Code Content</div>}
    </div>
  );
}

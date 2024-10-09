"use client";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import BookmarkView from "./left-view-model/BookmarkView";
import HistoryView from "./left-view-model/HistoryView";
import { CSSTransition } from "react-transition-group";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useShowBaseStore } from "./ShowMapIndex";
import EditBookmarkView from "./left-view-model/EditBookmarkView";
export default function LeftToolView({
  session,
}: {
  session?: Session | null;
}) {
  const [isLeftAct, setIsLeftAct, selectedModule] = useShowBaseStore(
    (state: any) => [state.isLeftAct, state.setIsLeftAct, state.selectedModule]
  );

  return (
    <CSSTransition
      in={isLeftAct}
      timeout={300}
      classNames={{
        enter: styles["left-view-enter"],
        enterActive: styles["left-view-enter-active"],
        exit: styles["left-view-exit"],
        exitActive: styles["left-view-exit-active"],
      }}
      mountOnEnter
      unmountOnExit
    >
      <div className={styles["left-view"] + " shadow"}>
        {selectedModule === "Bookmark" && <BookmarkView session={session} />}
        {selectedModule === "History" && (
          <HistoryView setIsAct={setIsLeftAct} />
        )}
        {selectedModule === "EditBookmark" && <EditBookmarkView />}
      </div>
    </CSSTransition>
  );
}

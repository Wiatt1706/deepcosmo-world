"use client";
import { useEffect, useRef } from "react";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import BookmarkView from "./left-view-model/bookmark/BookmarkView";
import HistoryView from "./left-view-model/HistoryView";
import { CSSTransition } from "react-transition-group";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import EditBookmarkView from "./left-view-model/bookmark/EditBookmarkView";
import ShowBookmarkView from "./left-view-model/bookmark/ShowBookmarkView";
import { useAtom, useAtomValue } from "jotai";
import {
  isLeftActAtom,
  selectedModuleAtom,
  userCustomListAtom,
} from "../store/ShowBaseAtomStore";

export default function LeftToolView({
  session,
}: {
  session?: Session | null;
}) {
  const supabase = createClientComponentClient<Database>();

  const [isLeftAct, setIsLeftAct] = useAtom(isLeftActAtom);
  const [userCustomList, setUserCustomList] = useAtom(userCustomListAtom);
  const selectedModule = useAtomValue(selectedModuleAtom);

  const leftViewRef = useRef(null);

  const loadData = async () => {
    if (!session) return [];
    const { data } = await supabase
      .from("UserCustomList")
      .select("id, name, describe, type, status, sort")
      .eq("owner", session?.user.id)
      .order("created_at", { ascending: false });

    return data;
  };

  useEffect(() => {
    if (!userCustomList) {
      loadData().then((data) => {
        setUserCustomList(data || []);
      });
    }
  }, []);

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
      nodeRef={leftViewRef} // Use nodeRef instead of relying on findDOMNode
      mountOnEnter
      unmountOnExit
    >
      {/* Assign the ref to the element */}
      <div ref={leftViewRef} className={styles["left-view"] + " shadow"}>
        {selectedModule === "Bookmark" && <BookmarkView session={session} />}
        {selectedModule === "History" && (
          <HistoryView session={session} setIsAct={setIsLeftAct} />
        )}
        {selectedModule === "EditBookmark" && <EditBookmarkView />}
        {selectedModule === "ShowBookmark" && <ShowBookmarkView />}
      </div>
    </CSSTransition>
  );
}

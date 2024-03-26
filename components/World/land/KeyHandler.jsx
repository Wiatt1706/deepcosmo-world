import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  useMyStore,
  useToolStore,
  useElementStore,
  useTemporalStore,
} from "@/components/SocketManager";

const KeyListener = () => {
  const { isOpenPopup, setOpenPopup } = useToolStore();
  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);
  const { undo, redo } = useTemporalStore((state) => ({
    undo: state.undo,
    redo: state.redo,
  }));
  const [target, setTarget] = useElementStore((state) => [
    state.target,
    state.setTarget,
  ]);

  // 按键事件处理函数
  const handleEscape = () => {
    setOpenPopup(false);
  };

  const handleDelete = () => {
    if (target) {
      const updatedModelList = modelList.filter(
        (item) => item.id !== target.id
      );
      setModelList(updatedModelList);
      setTarget(null);
    }
  };

  // 使用快捷键
  useHotkeys("Escape", handleEscape);
  useHotkeys("Delete", handleDelete);
  useHotkeys("ctrl+shift+z", () => redo());
  useHotkeys("ctrl+z", () => undo());

  return null; // 这个组件不渲染任何内容
};

export default KeyListener;

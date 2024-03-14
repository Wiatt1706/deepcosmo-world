import { atom, useAtom } from "jotai";

import create from "zustand";

export const useStore = create((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));

export const useElementStore = create((set) => ({
  isOpen: false,
  isPerspective: false,
  sceneList: [],
  modelList: [],
  setOpen: (isOpen) => set({ isOpen }),
  setSceneList: (sceneList) => set({ sceneList }),
  setModelList: (modelList) => set({ modelList }),
  setPerspective: (isPerspective) => set({ isPerspective }),
}));

export const useBottomToolStore = create((set) => ({
  isOpenPopup: false,
  setOpenPopup: (isOpenPopup) => set({ isOpenPopup }),
}));

export const controlStatusAtom = atom({
  isSpaceDown: false,
  isMouseDown: false,
  isDragging: false,
  defStage: 0,
});

export const listModelsAtom = atom(null);

export const mouseStageAtom = atom(0);

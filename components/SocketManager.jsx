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
  setOpen: (isOpen) =>
    set({
      isOpen: isOpen,
    }),
  setSceneList: (sceneList) => set({ sceneList }),
  setPerspective: (isPerspective) => set({ isPerspective }),
}));

export const controlStatusAtom = atom({
  isSpaceDown: false,
  isMouseDown: false,
  isDragging: false,
  defStage: 0,
});

export const listModelsAtom = atom(null);

export const mouseStageAtom = atom(0);

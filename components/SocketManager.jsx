import { useEffect } from "react";

import { atom, useAtom } from "jotai";

import create from "zustand";

export const useStore = create((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));

export const controlStatusAtom = atom({
  isSpaceDown: false,
  isMouseDown: false,
  isDragging: false,
  defStage: 0,
});

export const listModelsAtom = atom(null);

export const mouseStageAtom = atom(0);

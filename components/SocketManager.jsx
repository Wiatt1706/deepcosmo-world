import { atom } from "jotai";

import { temporal } from "zundo";
import { create, useStore } from "zustand";

export const useUserStore = create((set) => ({
  checkLogin: null,
  setCheckLogin: (checkLogin) => set({ checkLogin }),
}));

export const useMyStore = create(
  temporal(
    (set) => ({
      modelList: [],
      systemInfo: {
        sceneColor: "#ffffff",
        sceneEvn: "city",
        sceneFogColor: "#ffffff",
        sceneFog: false,
        openGrid: true,
      },
      setModelList: (modelList, addToHistory = true) => {
        if (addToHistory) {
          set({ modelList });
        } else {
          set({ modelList }, false); // 禁用历史记录
        }
      },
      setSystemInfo: (key, value) =>
        set((state) => ({
          systemInfo: {
            ...state.systemInfo,
            [key]: value,
          },
        })),
    }),
    { limit: 100 }
  )
);

export const useTemporalStore = (selector, equality) =>
  useStore(useMyStore.temporal, selector, equality);

export const useExportStore = create((set) => ({
  target: false,
  saveTarget: false,
  setTarget: (target) => set({ target }),
  setSaveTarget: (saveTarget) => set({ saveTarget }),
}));

export const useElementStore = create((set) => ({
  target: null,
  sceneList: [],
  nodes: {},
  setTarget: (target) => set({ target }),
  setSceneList: (sceneList) => set({ sceneList }),
  setNodes: (nodes) => set({ nodes }),
}));

export const useToolStore = create((set) => ({
  isPerspective: false,
  isOpenElement: false,
  isOpenPopup: false,
  isOpenSystemSet: false,
  setOpenElement: (isOpenElement) => set({ isOpenElement }),
  setOpenPopup: (isOpenPopup) => set({ isOpenPopup }),
  setPerspective: (isPerspective) => set({ isPerspective }),
  setSystemSet: (isOpenSystemSet) => set({ isOpenSystemSet }),
}));

export const controlStatusAtom = atom({
  isSpaceDown: false,
  isMouseDown: false,
  isDragging: false,
  defStage: 0,
  mouseStage: 0,
});

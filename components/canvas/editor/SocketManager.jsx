import { temporal } from "zundo";
import { create, useStore } from "zustand";

export const useStatusStore = create((set) => ({
  isOpenElement: true,
  isMousePressed: false,
  operatingModes: 0,
  activeWallEditor: false,
  wallThickness: 50,
  renderScale: 1,
  originX: 0,
  originY: 0,
  setOpenElement: (isOpenElement) => set({ isOpenElement }),
  setIsMousePressed: (isMousePressed) => set({ isMousePressed }),
  setOperatingModes: (operatingModes) => set({ operatingModes }),
  setActiveWallEditor: (activeWallEditor) => set({ activeWallEditor }),
  setWallThickness: (wallThickness) => set({ wallThickness }),
  setRenderScale: (renderScale) => set({ renderScale }),
  setOriginX: (originX) => set({ originX }),
  setOriginY: (originY) => set({ originY }),
}));

export const useCanvasEditorStore = create(
  temporal(
    (set) => ({
      geometryList: [],
      lastWellPoint: null,
      projectInfo: {
        backgroundColor: "#ffffff",
        canvasBackgroundColor: "#272727",
        width: 2432,
        height: 1216,
      },
      setGeometryList: (geometryList) => {
        set({ geometryList });
      },
      setLastWellPoint: (lastWellPoint) => set({ lastWellPoint }),
      setProjectInfo: (key, value) =>
        set((state) => ({
          projectInfo: {
            ...state.projectInfo,
            [key]: value,
          },
        })),
    }),
    { limit: 1000 }
  )
);

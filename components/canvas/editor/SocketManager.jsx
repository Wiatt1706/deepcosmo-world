import { temporal } from "zundo";
import { create, useStore } from "zustand";

export const useStatusStore = create((set) => ({
  isOpenElement: true,
  isMousePressed: false,
  operatingModes: 0,
  activeWallEditor: false,
  wallThickness: 10,
  setOpenElement: (isOpenElement) => set({ isOpenElement }),
  setIsMousePressed: (isMousePressed) => set({ isMousePressed }),
  setOperatingModes: (operatingModes) => set({ operatingModes }),
  setActiveWallEditor: (activeWallEditor) => set({ activeWallEditor }),
  setWallThickness: (wallThickness) => set({ wallThickness }),
}));

export const useCanvasEditorStore = create(
  temporal(
    (set) => ({
      geometryList: [],
      lastWellPoint: null,
      projectInfo: {
        backgroundColor: "#ffffff",
        canvasBackgroundColor: "#272727",
        width: 640,
        height: 360,
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

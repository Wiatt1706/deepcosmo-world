import { temporal } from "zundo";
import { create, useStore } from "zustand";

export const useStatusStore = create((set) => ({
  isOpenElement: true,
  isSpacePressed: false,
  isMousePressed: false,
  setOpenElement: (isOpenElement) => set({ isOpenElement }),
  setIsSpacePressed: (isSpacePressed) => set({ isSpacePressed }),
  setIsMousePressed: (isMousePressed) => set({ isMousePressed }),
}));

export const useCanvasEditorStore = create(
  temporal(
    (set) => ({
      geometryList: [],
      projectInfo: {
        backgroundColor: "#ffffff",
        canvasBackgroundColor: "#272727",
        width: 640,
        height: 360,
      },
      setGeometryList: (geometryList) => {
        set({ geometryList });
      },
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

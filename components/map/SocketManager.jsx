import { temporal } from "zundo";
import { create } from "zustand";

export const useMapStore = create(
  temporal(
    (set) => ({
      toolInfo: {
        pixelSize: 20,
        brushSize: 1,
        editColor: "#000",
      },
      setSystemInfo: (key, value) =>
        set((state) => ({
          toolInfo: {
            ...state.toolInfo,
            [key]: value,
          },
        })),
    }),
    { limit: 100 }
  )
);

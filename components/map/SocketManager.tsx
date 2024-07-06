import { temporal } from "zundo";
import { create } from "zustand";
import { PixelBlock } from "@/types/MapTypes"; // 确保正确导入 PixelBlock 类型

export const useMapStore = create(
  temporal(
    (set) => ({
      toolInfo: {
        pixelSize: 20,
        brushSize: 5,
        editColor: "#000",
      },
      pixelBlocks: [] as PixelBlock[], // 初始化 pixelBlocks
      setSystemInfo: (key: string, value: any) =>
        set((state: any) => ({
          toolInfo: {
            ...state.toolInfo,
            [key]: value,
          },
        })),
      setPixelBlocks: (blocks: PixelBlock[]) =>
        set(() => ({
          pixelBlocks: blocks,
        })),
      updatePixelBlocks: (block: PixelBlock) =>
        set((state: any) => ({
          pixelBlocks: [...state.pixelBlocks, block],
        })),
    }),
    { limit: 100 }
  )
);

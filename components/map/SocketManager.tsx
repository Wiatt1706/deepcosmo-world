import { temporal } from "zundo";
import { create } from "zustand";
import { PixelBlock } from "@/types/MapTypes"; // 确保正确导入 PixelBlock 类型
import { TerrainType } from "./helpers/algorithm";

export const useEditMapStore = create(
  temporal(
    (set) => ({
      toolInfo: {
        pixelSize: 20,
        brushSize: 5,
        editColor: "#000",
      },
      terrainInfo: {
        maxPixels: 1000,
        detail: 5,
        roughness: 5,
        color: "#000",
        type: TerrainType.ALL,
      },
      pixelBlocks: [] as PixelBlock[], // 初始化 pixelBlocks
      initData: [] as PixelBlock[],
      setToolInfo: (key: string, value: any) =>
        set((state: any) => ({
          toolInfo: {
            ...state.toolInfo,
            [key]: value,
          },
        })),
      setTerrainInfo: (key: string, value: any) =>
        set((state: any) => ({
          terrainInfo: {
            ...state.terrainInfo,
            [key]: value,
          },
        })),
      setPixelBlocks: (blocks: PixelBlock[]) =>
        set(() => ({
          pixelBlocks: blocks,
        })),
      setInitData: (blocks: PixelBlock[]) =>
        set(() => ({
          initData: blocks,
        })),
    }),
    { limit: 100 }
  )
);

export const useMapStore = create(
  temporal(
    (set) => ({
      toolInfo: {
        pixelSize: 20,
        brushSize: 5,
        editColor: "#000",
      },
      pixelBlocks: [] as PixelBlock[], // 初始化 pixelBlocks
      setToolInfo: (key: string, value: any) =>
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

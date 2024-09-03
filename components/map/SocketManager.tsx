import { temporal } from "zundo";
import { create, useStore } from "zustand";
import { PixelBlock } from "@/types/MapTypes"; // 确保正确导入 PixelBlock 类型
import { TerrainType } from "./helpers/algorithm";

export const useBaseStore = create((set) => ({
  model: "OBSERVE",
  landInfo: {} as Land | {},
  toolInfo: {
    model: "OBSERVE",
    pixelSize: 20,
    brushSize: 1,
    pixelPadding: 0,
    editColor: "#000000",
    isGrid: true,
    terrain_maxPixels: 1000,
    terrain_detail: 5,
    terrain_roughness: 5,
    terrain_color: "#000000",
    terrain_type: TerrainType.ALL,
  },
  isSaveing: false,
  canSave: false,
  initData: [] as PixelBlock[],
  selectedPixelBlock: null as PixelBlock | null,
  setModel: (model: "OBSERVE" | "EDIT" | "FIXED") => set({ model }),
  setSelectedPixelBlock: (selectedPixelBlock: PixelBlock | null) =>
    set({ selectedPixelBlock }),
  setLandInfo: (key: string, value: Land) =>
    set((state: any) => ({
      landInfo: {
        ...state.landInfo,
        [key]: value,
      },
    })),
  setToolInfo: (key: string, value: any) =>
    set((state: any) => ({
      toolInfo: {
        ...state.toolInfo,
        [key]: value,
      },
    })),
  setInitData: (blocks: PixelBlock[]) =>
    set(() => ({
      initData: blocks,
    })),
  setInitialLandInfo: (initLandInfo: Land) =>
    set((state: any) => ({
      landInfo: {
        ...state.landInfo,
        ...initLandInfo,
      },
    })),
  setIsSaveing: (isSaveing: boolean) => set({ isSaveing }),
  setCanSave: (canSave: boolean) => set({ canSave }),
}));

export const temporalEditMapStore = <T,>(
  selector: (state: any) => T,
  equality?: (a: T, b: T) => boolean
) => useStore(useEditMapStore.temporal, selector, equality);

export const useEditMapStore = create(
  temporal(
    (set) => ({
      pixelBlocks: [] as PixelBlock[], // 初始化 pixelBlocks
      setPixelBlocks: (blocks: PixelBlock[]) =>
        set(() => ({
          pixelBlocks: blocks,
        })),
    }),
    { limit: 1000 }
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

import { PixelBlock, Position, PositionAndSize } from "@/types/MapTypes";
import { atom } from "jotai";
const initialViewport: PositionAndSize = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

// 定义你的原子
export const selectedPixelBlockAtom = atom<PixelBlock | null>(null);
export const lastListPixelBlockAtom = atom<PixelBlock[]>([]);

export const viewportAtom = atom<PositionAndSize>(initialViewport);
export const viewMapCenterAtom = atom<Position>({ x: 0, y: 0 });
export const selectedModuleAtom = atom<string>("");
export const userCustomListAtom = atom<any>(null);
export const isLeftActAtom = atom<boolean>(false);
export const selectedListObjAtom = atom<any>(null);
export const loadDataAtom = atom<PixelBlock[]>([]);

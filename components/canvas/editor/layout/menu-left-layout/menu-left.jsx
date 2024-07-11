"use client";
import styles from "./menu-left.module.css";
import NumInput from "@/components/utils/NumInput";
import {
  useStatusStore,
  useCanvasEditorStore,
} from "@/components/canvas/editor/SocketManager";
import { Input } from "@nextui-org/input";
export default function EditorMenuLeft() {
  const [isOpenElement, wallThickness, setWallThickness] = useStatusStore(
    (state) => [
      state.isOpenElement,
      state.wallThickness,
      state.setWallThickness,
    ]
  );
  const [projectInfo, setProjectInfo] = useCanvasEditorStore((state) => [
    state.projectInfo,
    state.setProjectInfo,
  ]);

  return (
    <>
      {isOpenElement && (
        <div
          className={styles.menuLeft}
          style={{ display: isOpenElement ? "block" : "none" }}
        >
          <div className=" w-full bg-white flex items-center justify-between p-3 mb-2"></div>
          <div className="w-full">
            <div className="w-full flex justify-between px-4">
              <label className="text-xs">背景颜色</label>
              <label className="text-xs">画板颜色</label>
            </div>
            <div className="w-full flex ">
              <Input
                type="color"
                radius="none"
                placeholder="背景颜色"
                labelPlacement="outside"
                value={projectInfo.backgroundColor}
                onChange={(e) =>
                  setProjectInfo("backgroundColor", e.target.value)
                }
              />
              <Input
                type="color"
                radius="none"
                placeholder="画板颜色"
                labelPlacement="outside"
                value={projectInfo.canvasBackgroundColor}
                onChange={(e) =>
                  setProjectInfo("canvasBackgroundColor", e.target.value)
                }
              />
            </div>
          </div>
          <div className="px-4 pt-2 w-full">
            <label className="text-xs">画布尺寸</label>

            <NumInput
              value={projectInfo.width}
              onUpdate={(value) => setProjectInfo("width", value)}
              prefix="W"
              suffix="px"
            />
            <NumInput
              value={projectInfo.height}
              onUpdate={(value) => setProjectInfo("height", value)}
              prefix="H"
              suffix="px"
            />
          </div>
          <div className="px-4 pt-2 w-full">
            <label className="text-xs">墙体编辑</label>

            <NumInput
              value={wallThickness}
              onUpdate={(value) => setWallThickness(value)}
              prefix="厚度"
              suffix="px"
            />
          </div>
        </div>
      )}
    </>
  );
}

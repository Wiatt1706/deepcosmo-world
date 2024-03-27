"use client";
import { useEffect, useMemo, useRef } from "react";
import {
  useMyStore,
  useElementStore,
  useExportStore,
} from "@/components/SocketManager";
import { useThree } from "@react-three/fiber";
import DynamicGeometry from "@/components/World/element/DynamicGeometry";
import ImportGeometry from "@/components/World/element/ImportGeometry";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { saveString } from "@/components/utils/DownUrl";
export function ListModels() {
  const modelsRef = useRef();
  const scene = useThree((state) => state.scene);
  const modelList = useMyStore((state) => state.modelList);
  const setSceneList = useElementStore((state) => state.setSceneList);
  const exporter = new GLTFExporter();
  const { target, setTarget } = useExportStore();

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  useEffect(() => {
    if (target) {
      exporter.parse(
        modelsRef.current,
        (result) => {
          // 导出二进制格式
          saveString(JSON.stringify(result), "object.glb");
          setTarget(null);
        },
        { binary: true } // 设置选项对象的 binary 属性为 true
      );
    }
  }, [target]);

  const modelComponents = useMemo(() => {
    return modelList?.map((modelData) =>
      modelData.type === "ImportGeometry" ? (
        <ImportGeometry key={modelData.id} data={modelData} />
      ) : (
        <DynamicGeometry key={modelData.id} data={modelData} />
      )
    );
  }, [modelList]);

  return <group ref={modelsRef}>{modelComponents}</group>;
}

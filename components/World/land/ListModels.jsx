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

  // 定义一个辅助函数，用于获取所有子元素的名称
  function getAllChildrenNames(model) {
    const names = [model.name];
    if (model.children && model.children.length > 0) {
      model.children.forEach((child) => {
        names.push(...getAllChildrenNames(child));
      });
    }
    return names;
  }

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  useEffect(() => {
    if (target) {
      const uniqueModelsRef = modelsRef.current.clone();
      // 过滤掉重复名称的模型
      const uniqueModels = uniqueModelsRef.children.filter(
        (model, index, array) => {
          // 获取当前模型及其所有子元素的名称
          const allNames = getAllChildrenNames(model);

          // 检查当前模型之前的所有模型是否有相同的名称
          const isUnique = !array.slice(0, index).some((otherModel) => {
            const otherAllNames = getAllChildrenNames(otherModel);
            return otherAllNames.some((name) => allNames.includes(name));
          });

          return isUnique;
        }
      );

      exporter.parse(
        uniqueModels,
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
      modelData.model === "ImportGeometry" ? (
        <ImportGeometry key={modelData.id} data={modelData} />
      ) : (
        <DynamicGeometry key={modelData.id} data={modelData} />
      )
    );
  }, [modelList]);

  return <group ref={modelsRef}>{modelComponents}</group>;
}

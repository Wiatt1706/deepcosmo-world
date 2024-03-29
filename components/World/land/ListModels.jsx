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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function ListModels({ landId }) {
  const modelsRef = useRef();
  const scene = useThree((state) => state.scene);
  const modelList = useMyStore((state) => state.modelList);
  const setSceneList = useElementStore((state) => state.setSceneList);
  const exporter = new GLTFExporter();
  const [saveTarget, setSaveTarget] = useExportStore((state) => [
    state.saveTarget,
    state.setSaveTarget,
  ]);
  const supabase = createClientComponentClient();

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

  const uploadData = async ({ filePath, file }) => {
    const { data, error } = await supabase.storage
      .from("model")
      .upload(filePath, file);
    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }
  };

  const handleSyncSave = (uniqueModels) => {
    const filePath = `public/${landId}/scene.gltf`;
    exporter.parse(uniqueModels, (result) => {
      uploadData({
        filePath: filePath,
        file: new Blob([JSON.stringify(result)], {
          type: "application/octet-stream",
        }),
      });
    });
    setSaveTarget(false);
  };

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  useEffect(() => {
    if (saveTarget) {
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

      handleSyncSave(uniqueModels);
    }
  }, [saveTarget]);

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

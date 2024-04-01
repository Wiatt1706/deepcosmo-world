import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImportGeometry from "@/components/World/element/ImportGeometry";
import DynamicGeometry from "@/components/World/element/DynamicGeometry";
import {
  useMyStore,
  useElementStore,
  useExportStore,
} from "@/components/SocketManager";
import { useNotification } from "@/components/utils/NotificationBar";

export function ListModels({ landId }) {
  const modelsRef = useRef();
  const scene = useThree((state) => state.scene);
  const modelList = useMyStore((state) => state.modelList);
  const setSceneList = useElementStore((state) => state.setSceneList);
  const [saveTarget, setSaveTarget] = useExportStore((state) => [
    state.saveTarget,
    state.setSaveTarget,
  ]);
  const addNotification = useNotification((state) => state.addNotification);

  const supabase = createClientComponentClient();
  const exporter = useMemo(() => new GLTFExporter(), []);

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  const uploadData = async ({ filePath, file }) => {
    try {
      const { data, error } = await supabase.storage
        .from("model")
        .upload(filePath, file, {
          upsert: true,
        });
      if (data) {
        console.log(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      addNotification("上传场景失败：" + error, "error", "Model Upload Error");
    }
  };

  const handleSyncSave = async (uniqueModels) => {
    const filePath = `public/${landId}/scene.glb`;
    exporter.parse(uniqueModels, async (result) => {
      await uploadData({
        filePath: filePath,
        file: new Blob([JSON.stringify(result)], {
          type: "application/octet-stream",
        }),
      });
      setSaveTarget(false);
    });
  };

  useEffect(() => {
    if (saveTarget) {
      const uniqueModelsRef = modelsRef.current.clone();
      const uniqueModels = uniqueModelsRef.children.filter(
        (model, index, array) => {
          const allNames = getAllChildrenNames(model);
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

  const getAllChildrenNames = (model) => {
    const names = [model.name];
    if (model.children && model.children.length > 0) {
      model.children.forEach((child) => {
        names.push(...getAllChildrenNames(child));
      });
    }
    return names;
  };

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

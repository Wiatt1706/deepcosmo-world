"use client";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  useElementStore,
  useMyStore,
  useExportStore,
} from "@/components/SocketManager";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/model/";

export const SaveButton = ({ landInfo }) => {
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const sceneList = useElementStore((state) => state.sceneList);
  const modelList = useMyStore((state) => state.modelList);

  const { saveTarget, setSaveTarget } = useExportStore();

  const fetchData = async (models) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...landInfo, models }), // 传入一个对象
      };

      const res = await fetch("/api/land", requestOptions);
      const data = await res.json();
      console.log("Fetch data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  function updateModelData(modelList, sceneItem) {
    const { userData, position, rotation, scale, children } = sceneItem;

    if (userData && userData.primaryId) {
      const matchingModel = modelList.find(
        (modelItem) => modelItem.id === userData.primaryId
      );

      if (matchingModel) {
        // 将 position、rotation 和 scale 转换为数组格式，记录其 xyz 值
        const newPosition = [position.x, position.y, position.z];
        const newRotation = [rotation._x, rotation._y, rotation._z];
        const newScale = [scale.x, scale.y, scale.z];

        // 更新匹配的 modelList 元素的数据
        matchingModel.position = newPosition;
        matchingModel.rotation = newRotation;
        matchingModel.scale = newScale;
        if (matchingModel.type === "ImportGeometry") {
          const filePath = `public/model/${matchingModel.id}.gltf`;
          matchingModel.model_url = PUBLIC_URL + filePath;
        }
      }
    }

    // 递归遍历子模型
    if (children && children.length > 0) {
      children.forEach((child) => {
        updateModelData(modelList, child);
      });
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      // 出发模型上传
      setSaveTarget(true);
      // 更新模型数据
      sceneList.forEach((sceneItem) => {
        updateModelData(modelList, sceneItem);
      });
      // 请求保存
      await fetchData(modelList);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <>
      <Button
        className="bg-primary text-white border border-conditionalborder-transparent mx-2"
        size="sm"
        radius="none"
        isLoading={loading}
        onPress={onOpen}
      >
        Save
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                保存提醒
              </ModalHeader>
              <ModalBody>
                <p>是否将当前的元素保存至土块（{landInfo.land_name}）</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} onClick={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

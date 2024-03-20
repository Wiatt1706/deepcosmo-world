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
import { useElementStore } from "@/components/SocketManager";
export const SaveButton = ({ landInfo }) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { modelList, sceneList } = useElementStore();
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

  const handleSave = async () => {
    try {
      setLoading(true);
      sceneList.forEach((sceneItem) => {
        const { userData, position, rotation, scale } = sceneItem;
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
          }
        }
      });

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

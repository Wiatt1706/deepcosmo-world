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

// 递归函数，用于提取子对象的 children
function extractChildren(object, result) {
  if (!object.children || object.children.length === 0) {
    return;
  }
  for (let child of object.children) {
    result.push(child);
    extractChildren(child, result);
  }
}
// 提取所有子对象到一个大集合中，并删除每个对象的 children 字段
function extractAllChildren(modelList) {
  let allChildren = [];

  // 加入原始 modelList 中的对象
  for (let model of modelList) {
    allChildren.push(model);
  }

  // 提取子对象并删除 children 字段
  for (let model of modelList) {
    extractChildren(model, allChildren);
  }

  // 删除每个对象的 children 字段
  for (let obj of allChildren) {
    delete obj.children;
  }

  return allChildren;
}

export const SaveButton = ({ landInfo }) => {
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modelList = useMyStore((state) => state.modelList);
  const sceneList = useElementStore((state) => state.sceneList);
  const setSaveTarget = useExportStore((state) => state.setSaveTarget);

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
        updateModelData(modelList, sceneItem);
      });
      let allChildren = extractAllChildren(modelList);
      // 出发模型上传
      setSaveTarget(true);
      // // 请求保存

      await fetchData(allChildren);
    } catch (error) {
      console.error("Save error:", error);
      setLoading(false);
    }
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
      }
    }

    // 递归遍历子模型
    if (children && children.length > 0) {
      children.forEach((child) => {
        updateModelData(modelList, child);
      });
    }
  }

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

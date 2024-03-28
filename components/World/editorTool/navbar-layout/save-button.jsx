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

  const handleSave = async () => {
    try {
      setLoading(true);

      console.log("Saving model data:", modelList);
      // 出发模型上传
      // setSaveTarget(true);
      // // 更新模型数据
      // sceneList.forEach((sceneItem) => {
      //   updateModelData(modelList, sceneItem);
      // });
      // // 请求保存
      // await fetchData(modelList);
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

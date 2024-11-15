"use client";
import { useEffect, useState } from "react";
import { PixelBlock } from "@/types/MapTypes";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { AddMapValidAimAtom, AddMapValidBlocksAtom } from "./AddMapCanvas";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@nextui-org/button";
import PhotosModel from "../Model_Photos";
import { InfoSection } from "../../View_Act";
import { ModalBody, ModalFooter, Spinner } from "@nextui-org/react";
import { post as postApi, put as putApi, del as delApi } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";
import { uploadImgFromBlobUrl } from "@/components/hook/canvas/useUpdate";
import { useNotification } from "@/components/utils/NotificationBar";

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const bucket = "deepcosmo_img";
export default function EditAddMap({
  session,
  landInfo,
  onNext,
  onPrev,
}: {
  session?: Session | null;
  landInfo: Land;
  onNext: () => void;
  onPrev: () => void;
}) {
  const supabase = createClientComponentClient();
  const addNotification = useNotification(
    (state: any) => state.addNotification
  );

  const [selectedPixelBlock, setSelectedPixelBlock] =
    useState<PixelBlock | null>(null);
  const [addMapValidBlocks, setAddMapValidBlocks] = useAtom(
    AddMapValidBlocksAtom
  );
  const [validAim, setValidAim] = useAtom(AddMapValidAimAtom);

  const [isLoading, setIsLoading] = useState(false); // 跟踪加载状态

  const saveInfo = async () => {
    const block = selectedPixelBlock;
    if (!block) {
      return;
    }
    setIsLoading(true); // 开始加载
    if (block.landCoverImg) {
      const filePath = `public/landCover/${uuidv4()}.jpg`;
      const uploadData = await uploadImgFromBlobUrl(
        supabase,
        bucket,
        filePath,
        block.landCoverImg
      );
      block.landCoverImg = uploadData
        ? `${PUBLIC_URL}/storage/v1/object/public/${uploadData.fullPath}`
        : null;
    }

    if (block.showCoverImgList && block.showCoverImgList.length > 0) {
      for (let i = 0; i < block.showCoverImgList.length; i++) {
        const img = block.showCoverImgList[i];
        if (img.src) {
          const filePath = `public/showCover/${uuidv4()}.jpg`;
          const uploadData = await uploadImgFromBlobUrl(
            supabase,
            bucket,
            filePath,
            img.src
          );
          if (uploadData) {
            img.src = `${PUBLIC_URL}/storage/v1/object/public/${uploadData.fullPath}`;
            img.id = uploadData.path;
          } else {
            block.showCoverImgList.splice(i, 1);
            i--;
          }
        }
      }
    }
    await postApi(`/landInfo/addMap`, {
      pixelBlocks: block,
      deleteIds: addMapValidBlocks.map((b) => b.id),
      parentLandId: landInfo.id,
    })
      .then((response) => {
        if (response?.data) {
          addNotification("添加当前地块成功，", "success", "添加成功");
          setValidAim(null);
          setAddMapValidBlocks([]);
          onNext();
        } else {
          addNotification("添加当前地块失败，", "error", "添加失败");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (validAim) {
      const newPixelBlock: PixelBlock = {
        id: validAim.x + "," + validAim.y,
        x: validAim.x,
        y: validAim.y,
        width: validAim.width,
        height: validAim.height,
        blockCount: addMapValidBlocks.length,
        color: "#dadddf",
        type: 0,
        status: 0,
      };
      setSelectedPixelBlock(newPixelBlock);
    }
  }, [validAim, addMapValidBlocks]);
  return (
    <>
      <ModalBody className="w-full">
        <div className="flex flex-col relative">
          {selectedPixelBlock ? (
            <>
              <PhotosModel
                selectedPixelBlock={selectedPixelBlock}
                setSelectedPixelBlock={setSelectedPixelBlock}
                showCoverImgs={selectedPixelBlock?.showCoverImgList}
              />
              <div>
                <InfoSection
                  selectedPixelBlock={selectedPixelBlock}
                  setSelectedPixelBlock={setSelectedPixelBlock}
                />
              </div>
            </>
          ) : (
            <Spinner label="Loading..." color="warning" />
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d_c_b w-full">
          <Button color="primary" size="sm" onClick={onPrev}>
            上一步
          </Button>
          <Button
            color="primary"
            size="sm"
            onClick={saveInfo}
            isDisabled={!selectedPixelBlock}
            isLoading={isLoading}
          >
            保存
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}

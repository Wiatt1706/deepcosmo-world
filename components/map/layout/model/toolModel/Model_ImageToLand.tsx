import React, { useState, useRef } from "react";
import styles from "@/styles/canvas/ViewLeftTool.module.css";
import { PixelBlock } from "@/types/MapTypes";
import { TbPhoto, TbTrash, TbCheck, TbHelpOctagon } from "react-icons/tb";
import { ImgToPixel } from "@/components/map/helpers/ImgToPixel";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useEditMapStore } from "@/components/map/SocketManager";
import { IntegrationData, isRectIntersect } from "./Model_Upload";

export default function ModelImageToLand({ onClose }: { onClose: () => void }) {
  const [imageData, setImageData] = useState<PixelBlock[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 保存选择的图片URL
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hasIntersection, setHasIntersection] = useState(false); // 是否存在相交的块

  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);

  const handlePhotoBtn = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 模拟点击文件输入
    }
  };
  const handleSave = () => {
    setPixelBlocks([...pixelBlocks, ...imageData]);
    onClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const img = new Image();
          img.src = e.target.result as string;
          setSelectedImage(img.src); // 保存图片的URL
          img.onload = () => {
            ImgToPixel(img, 20).then((data: PixelBlock[]) => {
              setImageData(data); // 设置 imageData

              const intersectingBlocks = new Set<PixelBlock>();
              data.forEach((newBlock) => {
                pixelBlocks.forEach((existingBlock: PixelBlock) => {
                  if (isRectIntersect(newBlock, existingBlock)) {
                    intersectingBlocks.add(existingBlock);
                  }
                });
              });
              setHasIntersection(intersectingBlocks.size > 0); // 更新相交状态
            });
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null); // 清除图片URL
    setImageData([]); // 清空 imageData
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 重置文件输入
    }
  };

  const handleGenerate = (a: PixelBlock[], b: PixelBlock[]) => {
    setPixelBlocks(IntegrationData(a, b));
    onClose();
  };
  return (
    <div className="mb-4">
      {/* 隐藏的文件输入 */}
      <input
        id="imageInput"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* 上传图片按钮 */}
      <div
        className={`${styles["bottom-tool-box"]} px-[100px] cursor-pointer hover:bg-gray-200`}
        onClick={handlePhotoBtn}
      >
        <TbPhoto size={25} />
        <span className="ml-2">上传图片</span>
      </div>

      {/* 如果有图片和生成的数据，显示"生成"和"删除"按钮 */}
      {selectedImage && (
        <>
          {/* 预览选中的图片 */}
          <div className="mt-4">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full h-auto"
            />
          </div>

          <ButtonGroup className="w-full my-4">
            <Button
              isIconOnly
              size="lg"
              aria-label="TbTrashFilled"
              onClick={handleDeleteImage}
            >
              <TbTrash />
            </Button>
            {hasIntersection ? ( // 如果存在相交块，显示累增和融入按钮
              <>
                <Button
                  className="w-full"
                  size="lg"
                  aria-label="replace"
                  onClick={() => handleGenerate(imageData, pixelBlocks)}
                >
                  删除导入重复
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  color="primary"
                  aria-label="merge"
                  onClick={() => handleGenerate(pixelBlocks, imageData)}
                >
                  删除已有重复
                </Button>
              </>
            ) : (
              // 不存在相交块时，仅显示“保存”按钮
              <Button
                className="w-full"
                size="lg"
                color="primary"
                aria-label="save"
                onClick={handleSave}
              >
                保存
              </Button>
            )}
          </ButtonGroup>
          {hasIntersection && (
            <div className="flex gap-2 items-center text-sm text-gray-500 p-2">
              <TbHelpOctagon /> 存在相交的冲突像素块
            </div>
          )}
        </>
      )}
    </div>
  );
}

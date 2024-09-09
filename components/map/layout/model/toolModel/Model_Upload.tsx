import React, { useState } from "react";
import { TbUpload, TbTrash, TbHelpOctagon } from "react-icons/tb"; // 引入删除图标
import { utils, read } from "xlsx";
import { PixelBlock } from "@/types/MapTypes";
import TableShow from "@/components/utils/TeabelShow";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useEditMapStore } from "@/components/map/SocketManager";

export const IntegrationData = (
  pixelBlocks: PixelBlock[],
  excelData: PixelBlock[]
) => {
  let updatedBlocks = [...pixelBlocks]; // 复制现有的 pixelBlocks
  const intersectingBlocks = new Set<PixelBlock>(); // 存储相交的 pixelBlocks

  // 查找与 excelData 相交的 pixelBlocks
  excelData.forEach((newBlock) => {
    pixelBlocks.forEach((existingBlock: PixelBlock) => {
      if (isRectIntersect(newBlock, existingBlock)) {
        intersectingBlocks.add(existingBlock); // 找到相交的 block
      }
    });
  });

  if (intersectingBlocks.size > 0) {
    // 从 pixelBlocks 中删除相交的 blocks
    updatedBlocks = updatedBlocks.filter(
      (block) => !intersectingBlocks.has(block)
    );
  }

  return [...updatedBlocks, ...excelData];
};

// 校验导入数据是否符合 PixelBlock 接口
const isValidPixelBlock = (data: any): data is PixelBlock => {
  return (
    typeof data.id === "string" &&
    typeof data.x === "number" &&
    typeof data.y === "number" &&
    typeof data.width === "number" &&
    typeof data.height === "number" &&
    (typeof data.color === "string" || typeof data.color === "object") &&
    typeof data.blockCount === "number" &&
    typeof data.type === "number"
  );
};

// 判断两个矩形是否相交
export const isRectIntersect = (
  rectA: PixelBlock,
  rectB: PixelBlock
): boolean => {
  return !(
    (
      rectA.x + rectA.width <= rectB.x || // A的右边在B的左边
      rectA.x >= rectB.x + rectB.width || // A的左边在B的右边
      rectA.y + rectA.height <= rectB.y || // A的下边在B的上边
      rectA.y >= rectB.y + rectB.height
    ) // A的上边在B的下边
  );
};

export default function ModelUpload({ onClose }: { onClose: () => void }) {
  const [excelData, setExcelData] = useState<PixelBlock[]>([]); // 存储PixelBlock数据
  const [pixelBlocks, setPixelBlocks] = useEditMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);
  const [hasIntersection, setHasIntersection] = useState(false); // 是否存在相交的块

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });

      // 读取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 将工作表转为JSON数据
      const jsonData = utils.sheet_to_json(worksheet);

      // 过滤和校验数据是否符合 PixelBlock 接口
      const validData = jsonData.filter((item) => isValidPixelBlock(item));

      if (validData.length > 0) {
        setExcelData(validData as PixelBlock[]);
        // 检查是否存在相交的块
        const intersectingBlocks = new Set<PixelBlock>();
        (validData as PixelBlock[]).forEach((newBlock) => {
          pixelBlocks.forEach((existingBlock: PixelBlock) => {
            if (isRectIntersect(newBlock, existingBlock)) {
              intersectingBlocks.add(existingBlock);
            }
          });
        });
        setHasIntersection(intersectingBlocks.size > 0); // 更新相交状态
      } else {
        console.log("没有符合 PixelBlock 格式的数据");
      }
    };
    reader.readAsArrayBuffer(file); // 读取文件
  };
  const handleSave = () => {
    setPixelBlocks([...pixelBlocks, ...excelData]);
    onClose();
  };
  // 处理删除导入的数据
  const handleDelete = () => {
    setExcelData([]); // 清空数据
    console.log("数据已删除");
  };

  const handlePhotoBtn = (id: string) => {
    document.getElementById(id)!.click();
  };

  const handleMerge = (a: PixelBlock[], b: PixelBlock[]) => {
    setPixelBlocks(IntegrationData(a, b));
    onClose();
  };

  return (
    <div className="mb-4">
      {/* 上传文件的 input */}
      <input
        id="showXlsx"
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileUpload}
        className="mt-2"
      />

      <div className="flex gap-2">
        {/* 动态切换上传和删除按钮 */}
        {excelData.length === 0 && (
          <div
            onClick={() => handlePhotoBtn("showXlsx")}
            className="min-w-[60px] min-h-[60px] border border-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
          >
            <TbUpload size={30} color="#63727e" />
          </div>
        )}
      </div>

      {/* 展示导入的有效 PixelBlock 数据 */}
      {excelData.length > 0 && (
        <div>
          <TableShow pixelBlocks={excelData} />
          <ButtonGroup className="w-full my-4">
            <Button
              isIconOnly
              size="lg"
              aria-label="TbTrashFilled"
              onClick={handleDelete}
            >
              <TbTrash />
            </Button>
            {hasIntersection ? ( // 如果存在相交块，显示累增和融入按钮
              <>
                <Button
                  className="w-full"
                  size="lg"
                  aria-label="replace"
                  onClick={() => handleMerge(excelData, pixelBlocks)}
                >
                  删除导入重复
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  color="primary"
                  aria-label="merge"
                  onClick={() => handleMerge(pixelBlocks, excelData)}
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
        </div>
      )}
    </div>
  );
}

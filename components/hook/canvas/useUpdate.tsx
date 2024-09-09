"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Photo, PixelBlock } from "@/types/MapTypes";
import { post as postApi, put as putApi, del as delApi } from "@/utils/api";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UploadService } from "@/utils/serviceimpl";
import { v4 as uuidv4 } from "uuid";
import { useBaseStore, useEditMapStore } from "@/components/map/SocketManager";
import { useNotification } from "@/components/utils/NotificationBar";

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const bucket = "deepcosmo_img";

// 防抖函数
export const useDebounce = (
  callback: () => void,
  delay: number,
  deps: any[]
) => {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
};

const useUpdate = (landId?: string, initData?: PixelBlock[]) => {
  const supabase = createClientComponentClient();

  const addNotification = useNotification((state) => state.addNotification);

  const [setCanSave, isSaveing, setIsSaveing, landInfo] = useBaseStore(
    (state: any) => [
      state.setCanSave,
      state.isSaveing,
      state.setIsSaveing,
      state.landInfo,
    ]
  );

  const pixelBlocks = useEditMapStore(
    useCallback((state: any) => state.pixelBlocks as PixelBlock[], [])
  );

  const [processBlocksChangesMap, setProcessBlocksChangesMap] = useState(
    () => new Map(initData?.map((block) => [`${block.x}_${block.y}`, block]))
  );
  const [originalPixelBlocksMap, setOriginalPixelBlocksMap] = useState(
    () => new Map(initData?.map((block) => [`${block.x}_${block.y}`, block]))
  );

  const addedBlocksRef = useRef(new Map<string, PixelBlock>());
  const modifiedBlocksRef = useRef(new Map<string, PixelBlock>());
  const deletedBlocksRef = useRef(new Set<string>());

  // 处理块变化的逻辑
  const processBlocksChanges = useCallback(() => {
    const currentPixelBlocksMap = new Map(
      pixelBlocks.map((block) => [`${block.x}_${block.y}`, block])
    );

    currentPixelBlocksMap.forEach((block, id) => {
      const originalBlock = processBlocksChangesMap.get(id);

      if (!originalBlock) {
        // 添加的新块
        deletedBlocksRef.current.has(id)
          ? deletedBlocksRef.current.delete(id)
          : addedBlocksRef.current.set(id, block);
      } else if (JSON.stringify(block) !== JSON.stringify(originalBlock)) {
        // 修改后的块
        addedBlocksRef.current.has(id)
          ? addedBlocksRef.current.set(id, block)
          : modifiedBlocksRef.current.set(id, block);
      }
    });

    processBlocksChangesMap.forEach((_, id) => {
      if (!currentPixelBlocksMap.has(id)) {
        // 被删除的块
        addedBlocksRef.current.has(id)
          ? addedBlocksRef.current.delete(id)
          : deletedBlocksRef.current.add(id);
      }
    });

    setProcessBlocksChangesMap(currentPixelBlocksMap);
    setCanSave(
      addedBlocksRef.current.size > 0 ||
        modifiedBlocksRef.current.size > 0 ||
        deletedBlocksRef.current.size > 0
    );
  }, [pixelBlocks, processBlocksChangesMap, setCanSave]);

  // 使用防抖机制来优化 pixelBlocks 的变动检测
  useDebounce(processBlocksChanges, 2000, [pixelBlocks]);

  // 保存数据变化的逻辑
  const saveChanges = useCallback(async () => {
    if (
      addedBlocksRef.current.size === 0 &&
      modifiedBlocksRef.current.size === 0 &&
      deletedBlocksRef.current.size === 0
    ) {
      setIsSaveing(false);
      setCanSave(false);
      return;
    }

    const uploadImgFromBlobUrl = async (
      bucket: string,
      filePath: string,
      blobUrl: string
    ) => {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        return UploadService.uploadImg(
          supabase,
          bucket,
          filePath,
          new Blob([blob], { type: blob.type })
        );
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    };

    const processAddedBlocks = async (addedBlocks: PixelBlock[]) => {
      // 处理图片上传
      for (const block of addedBlocks) {
        if (block.landCoverImg) {
          const filePath = `public/landCover/${uuidv4()}.jpg`;
          const uploadData = await uploadImgFromBlobUrl(
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
      }

      await postApi(`/landInfo`, {
        pixelBlocks: addedBlocks,
        parentLandId: landId,
      }).then((response) => {
        if (response.data) {
          console.log("Added Blocks:", addedBlocks);
        } else {
          console.error("Failed to processAddedBlocks:", response.data.message);
        }
      });
    };

    const processModifiedBlocks = async (modifiedBlocks: PixelBlock[]) => {
      const updatedBlocks = modifiedBlocks.map((modifiedBlock) => {
        const blockId = `${modifiedBlock.x}_${modifiedBlock.y}`;
        const originalBlock = originalPixelBlocksMap.get(blockId);

        if (!originalBlock) return modifiedBlock;

        const diffBlock: Record<string, unknown> = {
          id: modifiedBlock.id,
          x: modifiedBlock.x,
          y: modifiedBlock.y,
        };
        for (const key in modifiedBlock) {
          if (
            modifiedBlock.hasOwnProperty(key) &&
            JSON.stringify(modifiedBlock[key as keyof PixelBlock]) !==
              JSON.stringify(originalBlock[key as keyof PixelBlock])
          ) {
            diffBlock[key] = modifiedBlock[key as keyof PixelBlock];
          }
        }
        return diffBlock;
      });

      console.log("updatedBlocks Blocks:", updatedBlocks);
      const deleteIds: string[] = [];
      // 图片上传检测
      for (const block of updatedBlocks) {
        const originalBlock = originalPixelBlocksMap.get(
          `${block.x}_${block.y}`
        );
        // 检查是否有 `landCoverImg` 的更新或删除
        if (block.landCoverImg !== undefined) {
          const fileName =
            "public/landCover/" +
            originalBlock?.landCoverImg?.match(/[^/]+$/)?.[0];
          if (block.landCoverImg === null && fileName) {
            deleteIds.push(fileName);
          } else if (typeof block.landCoverImg === "string") {
            // 处理图片更新逻辑
            const filePath = `public/landCover/${uuidv4()}.jpg`;
            const uploadData = await uploadImgFromBlobUrl(
              bucket,
              filePath,
              block.landCoverImg
            );
            block.landCoverImg = uploadData
              ? `${PUBLIC_URL}/storage/v1/object/public/${uploadData.fullPath}`
              : null;
          }
        }

        // 检查 `showCoverImgList` 的变化
        if (block.showCoverImgList) {
          const originalList = originalBlock?.showCoverImgList || [];
          const newList = block.showCoverImgList as Photo[];

          // 处理新增图片
          for (let i = 0; i < newList.length; i++) {
            const img = newList[i];
            const originalImg = originalList.find((o) => o.id === img.id);

            if (!originalImg) {
              // 新增图片的处理逻辑
              const filePath = `public/showCover/${uuidv4()}.jpg`;
              const uploadData = await uploadImgFromBlobUrl(
                bucket,
                filePath,
                img.src
              );
              if (uploadData) {
                img.src = `${PUBLIC_URL}/storage/v1/object/public/${uploadData.fullPath}`;
                img.id = uploadData.path;
              } else {
                newList.splice(i, 1);
                i--;
              }
            } else if (img.src !== originalImg.src) {
              // 更新图片的处理逻辑
              const filePath = `public/showCover/${uuidv4()}.jpg`;
              const uploadData = await uploadImgFromBlobUrl(
                bucket,
                filePath,
                img.src
              );
              if (uploadData) {
                img.src = `${PUBLIC_URL}/storage/v1/object/public/${uploadData.fullPath}`;
              }
            }
          }

          // 处理删除图片
          for (const originalImg of originalList) {
            if (!newList.find((n) => n.id === originalImg.id)) {
              // 收集需要删除的图片 ID
              deleteIds.push(originalImg.id);
            }
          }
        }
      }

      // 调用删除图片的服务
      if (deleteIds.length > 0) {
        await UploadService.deleteImg(supabase, bucket, deleteIds);
      }

      await putApi(`/landInfo`, {
        updatedBlocks: updatedBlocks,
        parentLandId: landId,
      }).then((response) => {
        if (response.data) {
          console.log("Modified Blocks:", modifiedBlocks);
        } else {
          console.error("Failed to processModifiedBlocks:", response.data);
        }
      });
    };

    const processDeletedBlocks = async (deletedBlocks: Set<string>) => {
      const deleteIds: string[] = []; // 用于存储需要删除的图片ID

      const pixelBlocks = Array.from(deletedBlocks).map((block) => {
        const [x, y] = block.split("_").map(Number);
        const blockId = `${x}_${y}`;
        const originalBlock = originalPixelBlocksMap.get(blockId);

        // 检查 landCoverImg 字段
        if (originalBlock?.landCoverImg) {
          const fileName =
            "public/landCover/" +
            originalBlock?.landCoverImg?.match(/[^/]+$/)?.[0];
          if (fileName) {
            deleteIds.push(fileName);
          }
        }

        // 检查 showCoverImgList 字段
        if (originalBlock?.showCoverImgList) {
          for (const img of originalBlock.showCoverImgList) {
            const fileName = img.id;
            if (fileName) {
              deleteIds.push(fileName);
            }
          }
        }

        return { x, y };
      });

      // 删除相关图片
      if (deleteIds.length > 0) {
        try {
          await UploadService.deleteImg(supabase, bucket, deleteIds);
          console.log("Deleted Images:", deleteIds);
        } catch (error) {
          console.error("Failed to delete images:", error);
        }
      }

      await delApi(`/landInfo`, {
        pixelBlocks: pixelBlocks,
        parentLandId: landId,
      }).then((response) => {
        if (response.data) {
          console.log("Deleted Blocks:", deletedBlocks);
        } else {
          console.error("Failed to processDeletedBlocks:", response.data);
        }
      });
    };

    await Promise.all([
      addedBlocksRef.current.size > 0
        ? processAddedBlocks(Array.from(addedBlocksRef.current.values()))
        : Promise.resolve(),
      modifiedBlocksRef.current.size > 0
        ? processModifiedBlocks(Array.from(modifiedBlocksRef.current.values()))
        : Promise.resolve(),
      deletedBlocksRef.current.size > 0
        ? processDeletedBlocks(deletedBlocksRef.current)
        : Promise.resolve(),
    ]);

    setOriginalPixelBlocksMap(processBlocksChangesMap);
    addedBlocksRef.current.clear();
    modifiedBlocksRef.current.clear();
    deletedBlocksRef.current.clear();
    setIsSaveing(false);
  }, [
    landId,
    setCanSave,
    setIsSaveing,
    originalPixelBlocksMap,
    processBlocksChangesMap,
    supabase,
  ]);

  // 监听保存状态的变化
  useEffect(() => {
    if (isSaveing) {
      if (landInfo.capacity_size < landInfo.used_pixel_blocks) {
        addNotification("当前可用土块不足，无法保存，请减少使用量再次尝试", "error", "保存异常");
        setIsSaveing(false);
        return;
      }
      saveChanges();
    }
  }, [
    isSaveing,
    saveChanges,
    landInfo.capacity_size,
    landInfo.used_pixel_blocks,
  ]);
};

export default useUpdate;

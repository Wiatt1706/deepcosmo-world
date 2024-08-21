"use client";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useEffect, useState } from "react";
import {
  TbArrowDown,
  TbArrowUp,
  TbBrandBilibili,
  TbBrandYoutube,
  TbDotsVertical,
  TbLock,
  TbTrash,
  TbUpload,
} from "react-icons/tb";
import Cropper, { Area } from "react-easy-crop";
import { LAND_LEVEL, OPTION_TEST_LIST4, Photo } from "@/types/MapTypes";
import { Switch } from "@nextui-org/switch";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  RadioGroup,
} from "@nextui-org/react";
import { CustomRadio } from "../utils/CustomRadio";
import { v4 as uuidv4 } from "uuid";
import DateComponent from "../utils/DateComponent";
import { temporal } from "zundo";
import { create, useStore } from "zustand";
import Locked from "../utils/Locked";

import { put as putApi } from "@/utils/api";

export const temporalLandDetailStore = <T,>(
  selector: (state: any) => T,
  equality?: (a: T, b: T) => boolean
) => useStore(useLandDetailStore.temporal, selector, equality);

export const useLandDetailStore = create(
  temporal(
    (set) => ({
      landInfo: {},
      setLandInfo: (key: string, value: any) =>
        set((state: any) => ({
          landInfo: {
            ...state.landInfo,
            [key]: value,
          },
        })),
      setInitialLandInfo: (initLandInfo: any) =>
        set((state: any) => ({
          landInfo: {
            ...state.landInfo,
            ...initLandInfo,
          },
        })),
    }),
    { limit: 1000 }
  )
);

export default function LandInfoDetails({
  initLandInfo,
}: {
  initLandInfo: any;
}) {
  const [landInfo, setLandInfo, setInitialLandInfo] = useLandDetailStore(
    (state: any) => [
      state.landInfo,
      state.setLandInfo,
      state.setInitialLandInfo,
    ]
  );

  const { undo, redo } = temporalLandDetailStore((state: any) => ({
    undo: state.undo,
    redo: state.redo,
  }));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initLandInfo) {
      setInitialLandInfo(initLandInfo);
      console.log("initLandInfo", initLandInfo);
    }
  }, [initLandInfo, setInitialLandInfo]);

  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [croppingType, setCroppingType] = useState<
    "landCover" | "showCover" | null
  >(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [errorExternalLink, setErrorExternalLink] = useState<string | null>(
    null
  );
  const [selectedShowCover, setSelectedShowCover] = useState<Photo[]>(
    initLandInfo.ShowCoverImg || []
  );

  const handlePhotoBtn = (id: string) => {
    document.getElementById(id)!.click();
  };

  const handleLandCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropSrc(e.target?.result as string);
        setCroppingType("landCover");
        setCropAspect(1); // For 1:1 crop
        setCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShowCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length + selectedShowCover.length <= 3) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropSrc(e.target?.result as string);
        setCroppingType("showCover");
        setCropAspect(2 / 1); // For 2:1 crop
        setCropping(true);
      };
      reader.readAsDataURL(file);
    } else {
      alert("您只能选择最多3张图片。");
    }
  };

  const handleDelete = (id: string, type: "landCover" | "showCover") => {
    if (type === "landCover") {
      setLandInfo("cover_icon_url", null);
    } else if (type === "showCover") {
      const newSelectedShowCover = selectedShowCover.filter(
        (photo) => photo.id !== id
      );
      setSelectedShowCover(newSelectedShowCover);
    }
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setSelectedShowCover((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newArr.length) {
        [newArr[index], newArr[targetIndex]] = [
          newArr[targetIndex],
          newArr[index],
        ];
      }
      return newArr;
    });
  };

  const checkExternalLink = (v: string, type: string | undefined) => {
    const extractSrc = (iframe: string): string | null => {
      const srcMatch = iframe.match(/src=["']([^"']+)["']/);
      return srcMatch ? srcMatch[1] : null;
    };

    const url = extractSrc(v);

    if (!url) {
      setErrorExternalLink("无效链接");
      return null;
    }
    const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;
    switch (type) {
      case "Bilibili":
        if (absoluteUrl.includes("bilibili.com")) {
          setErrorExternalLink(null);
          return url;
        }
        setErrorExternalLink("Provided URL is not from Bilibili");
        break;

      case "Youtube":
        if (
          absoluteUrl.includes("youtube.com") ||
          absoluteUrl.includes("youtu.be")
        ) {
          setErrorExternalLink(null);
          return url;
        }
        setErrorExternalLink("Provided URL is not from YouTube");
        break;

      default:
        setErrorExternalLink("Unsupported type");
    }
    return null;
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = () => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = cropSrc!;
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      if (ctx && croppedAreaPixels) {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob!);
          const newPhoto = { src: url, id: uuidv4(), type: croppingType! };
          if (croppingType === "landCover") {
            setLandInfo("cover_icon_url", url);
          } else if (croppingType === "showCover") {
            const newSelectedShowCover = [...selectedShowCover, newPhoto];
            setSelectedShowCover(newSelectedShowCover);
          }
          setCropping(false);
          setCropSrc(null);
        });
      }
    };
  };

  const handleSaveData = async () => {
    if (errorExternalLink) {
      alert(errorExternalLink);
      return;
    }
    setIsLoading(true);

    // 找出改动的字段
    const changedFields: any = { id: initLandInfo.id }; // Include the mandatory ID field
    Object.keys(landInfo).forEach((key) => {
      if (landInfo[key] !== initLandInfo[key]) {
        changedFields[key] = landInfo[key];
      }
    });

    await putApi(`/landInfo/single`, changedFields).then((response) => {
      setIsLoading(false);
      if (response.data) {
        console.log("handleSaveData Blocks:", landInfo);
      } else {
        console.error("Failed to handleSaveData:", response.data.message);
      }
    });
  };

  useEffect(() => {
    if (landInfo.external_link) {
      const url = checkExternalLink(
        landInfo.external_link,
        landInfo.external_link_type
      );

      if (url) {
        setLandInfo("external_link", url);
      }
    }
  }, [landInfo.external_link_type, landInfo.external_link]);

  const LockMessage = (num: number) => (
    <div className="flex gap-2 items-center justify-center w-full p-8 bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer rounded text-gray-500 transition duration-1000 ease-in-out transform ">
      <TbLock size={20} color="#63727e" />
      合并{num}块土地解锁
    </div>
  );

  return (
    <div className="flex flex-col  bg-[#FFFFFF] max-w-[800px] rounded text-left m-4 border">
      <div
        className={`flex justify-between items-center w-full px-8 py-4 sticky top-0 bg-[#FFFFFF] z-[50] `}
      >
        <h1 className="text-2xl font-bold text-left text-[#20272c]">
          土块详细信息
        </h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => undo()} radius="full">
            撤销更改
          </Button>
          <Button
            isLoading={isLoading}
            size="sm"
            onClick={() => handleSaveData()}
            radius="full"
            color="primary"
          >
            保存
          </Button>
          <Button
            size="sm"
            radius="full"
            variant="light"
            isIconOnly
            startContent={<TbDotsVertical size={20} />}
          />
        </div>
      </div>
      <div className="w-full max-w-[1500px] px-8 pb-8 pt-2 flex flex-col gap-4 justify-start ">
        <div className="grid grid-cols-2 gap-4 p-4 bg-[#f3f6f8] rounded">
          <div className="flex items-center gap-2">
            <span className="text-sm">坐标：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {landInfo.world_coordinates_x}, {landInfo.world_coordinates_y}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">尺寸：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {landInfo.world_size_x}, {landInfo.world_size_y}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">类型：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {OPTION_TEST_LIST4[landInfo?.land_type]?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">级别：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {LAND_LEVEL[landInfo?.land_level]?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">使用像素块：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {landInfo.use_pixel_blocks || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">持有者：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {landInfo.author?.username}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">创建时间：</span>
            <span className="px-2 py-[2px] bg-[#f3f6f8] text-[12px] rounded">
              {landInfo.created_at && (
                <DateComponent dateString={landInfo?.created_at} label="" />
              )}
            </span>
          </div>
        </div>

        <Textarea
          label="标题（必填）"
          variant="bordered"
          value={landInfo.land_name}
          placeholder="Enter your description"
          description="18/1000"
          disableAnimation
          disableAutosize
          classNames={{
            base: "max-w-[1000px] text-left ",
            input: "resize-y max-h-[30px] h-[30px] w-full ",
          }}
          onValueChange={(v) => setLandInfo("land_name", v)}
        />

        <Textarea
          label="说明"
          variant="bordered"
          value={landInfo.land_description}
          placeholder="Enter your description"
          description="18/1000"
          disableAnimation
          disableAutosize
          classNames={{
            base: "max-w-[1000px] text-left",
            input: "resize-y max-h-[140px] h-[80px] w-full",
          }}
          onValueChange={(v) => setLandInfo("land_description", v)}
        />

        {cropping && cropSrc && (
          <Modal
            isOpen={cropping}
            onOpenChange={() => setCropping(false)}
            radius="none"
            backdrop="blur"
            size="xl"
          >
            <ModalContent>
              <ModalBody className="flex flex-col gap-2">
                <div className="w-full min-h-[400px]">
                  <Cropper
                    image={cropSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={cropAspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setCropping(false);
                    setCropSrc(null);
                  }}
                >
                  取消
                </Button>
                <Button color="primary" onPress={handleCropConfirm}>
                  确认裁剪
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        <input
          id="landCover"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleLandCoverChange}
        />
        <input
          id="showCover"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          multiple
          onChange={handleShowCoverChange}
        />
        <span className="text-sm text-gray-500 font-bold">土块封面</span>

        <Locked
          isLocked={landInfo?.block_count < 9}
          lockMessage={LockMessage(9)}
        >
          <div className="flex gap-2 mb-2 w-full">
            <div
              onClick={() => handlePhotoBtn("landCover")}
              className="w-[60px] h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
            >
              <TbUpload size={30} color="#63727e" />
            </div>
            {landInfo.cover_icon_url && (
              <div className="relative w-[100px] h-[100px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer">
                <img
                  src={landInfo.cover_icon_url}
                  alt="Land Cover"
                  className="w-full h-full object-cover"
                />
                <TbTrash
                  size={20}
                  className="absolute opacity-50 bottom-2 right-2 text-[#63727e] cursor-pointer hover:text-red-500 hover:opacity-100"
                  onClick={() =>
                    handleDelete(landInfo.cover_icon_url, "landCover")
                  }
                />
              </div>
            )}
          </div>
        </Locked>

        <span className="text-sm text-gray-500 font-bold">
          展示图 {selectedShowCover.length + "/3"}
        </span>

        <Locked
          isLocked={landInfo.block_count < 16}
          lockMessage={LockMessage(16)}
        >
          <div className="flex gap-2 mb-6">
            <div
              onClick={() => handlePhotoBtn("showCover")}
              className="min-w-[60px] min-h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
            >
              <TbUpload size={30} color="#63727e" />
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {selectedShowCover.map((cover, index) => (
                <div
                  key={cover.id}
                  className="relative w-full border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
                >
                  <img
                    src={cover.src}
                    alt={`Show Cover ${index}`}
                    className="w-full h-full object-cover max-w-[400px] max-h-[200px]"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <TbArrowUp
                      size={20}
                      className="text-[#63727e] opacity-50 cursor-pointer hover:text-blue-500 hover:opacity-100"
                      onClick={() => moveImage(index, "up")}
                    />
                    <TbArrowDown
                      size={20}
                      className="text-[#63727e] opacity-50 cursor-pointer hover:text-blue-500 hover:opacity-100"
                      onClick={() => moveImage(index, "down")}
                    />
                  </div>
                  <TbTrash
                    size={20}
                    className="absolute opacity-50 bottom-2 right-2 text-[#63727e] cursor-pointer hover:text-red-500 hover:opacity-100"
                    onClick={() => handleDelete(cover.id, "showCover")}
                  />
                </div>
              ))}
            </div>
          </div>
        </Locked>

        <span className="text-sm text-gray-500 font-bold">开启外站嵌入</span>

        <Locked
          isLocked={landInfo.block_count < 16}
          lockMessage={LockMessage(16)}
        >
          <div className="flex flex-col  mb-2 items-center rounded bg-[#f3f6f8]">
            <div className="flex items-center justify-between w-full p-6">
              <span className="text-sm text-gray-500 font-bold">
                使用外站链接
              </span>

              <Switch
                defaultSelected={landInfo.use_external_link}
                value={landInfo.use_external_link}
                onValueChange={(v) => setLandInfo("use_external_link", v)}
              />
            </div>
            {landInfo.use_external_link && (
              <div className="w-full px-6">
                <RadioGroup
                  label="提供方"
                  value={landInfo.external_link_type}
                  onValueChange={(value) =>
                    setLandInfo("external_link_type", value)
                  }
                  className="mb-4"
                >
                  <div className=" w-full flex items-center justify-between">
                    <CustomRadio description="Up to 20 items" value="Bilibili">
                      <TbBrandBilibili size={20} color="#009ccf" />
                      <span className="ml-2">Bilibili</span>
                    </CustomRadio>
                    <CustomRadio
                      description="Unlimited items. $10 per month."
                      value="Youtube"
                    >
                      <TbBrandYoutube size={20} color="#ff0000" />
                      <span className="ml-2">YouTube</span>
                    </CustomRadio>
                  </div>
                </RadioGroup>

                {landInfo.external_link_type && (
                  <div>
                    <span className="text-default-500 text-sm">
                      其提供 {landInfo.external_link_type}
                      的iframe嵌入代码
                    </span>
                    <Textarea
                      isInvalid={errorExternalLink != null}
                      errorMessage={errorExternalLink}
                      variant="faded"
                      placeholder="拷贝嵌入代码"
                      className="w-full py-2 mb-2"
                      value={landInfo.external_link || ""}
                      onValueChange={(v) => setLandInfo("external_link", v)}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Locked>
      </div>
    </div>
  );
}

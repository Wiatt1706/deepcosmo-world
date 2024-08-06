import React, { useState, useEffect } from "react";
import PhotoSlider, { Photo } from "@/components/utils/PhotoGallery";
import styles from "@/styles/canvas/ViewAct.module.css";
import { clsx } from "clsx";
import {
  TbPhotoPlus,
  TbUpload,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
  TbBrandBilibili,
  TbBrandYoutube,
} from "react-icons/tb";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  Select,
  SelectItem,
  Switch,
  Textarea,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import Cropper, { Area } from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
import { useBaseStore } from "../../SocketManager";
import { CustomRadio } from "@/components/utils/CustomRadio";

export default function PhotosModel({
  landCoverImg,
  showCoverImgs,
}: {
  landCoverImg?: Photo;
  showCoverImgs?: Photo[];
}) {
  const [selectedShowCover, setSelectedShowCover] = useState<Photo[]>(
    showCoverImgs || []
  );
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
  const [externalLinkText, setExternalLinkText] = useState<string | null>(
    selectedPixelBlock.externalLink
  );
  useEffect(() => {
    setSelectedShowCover(showCoverImgs || []);
  }, [showCoverImgs]);

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
            setSelectedPixelBlock({
              ...selectedPixelBlock,
              landCoverImg: newPhoto,
            });
          } else if (croppingType === "showCover") {
            const newSelectedShowCover = [...selectedShowCover, newPhoto];
            setSelectedShowCover(newSelectedShowCover);
            setSelectedPixelBlock({
              ...selectedPixelBlock,
              showCoverImgList: newSelectedShowCover,
            });
          }
          setCropping(false);
          setCropSrc(null);
        });
      }
    };
  };

  const handleCropCancel = () => {
    setCropping(false);
    setCropSrc(null);
  };

  const handleDelete = (id: string, type: "landCover" | "showCover") => {
    if (type === "landCover") {
      setSelectedPixelBlock({
        ...selectedPixelBlock,
        landCoverImg: null,
      });
    } else if (type === "showCover") {
      const newSelectedShowCover = selectedShowCover.filter(
        (photo) => photo.id !== id
      );
      setSelectedShowCover(newSelectedShowCover);
      setSelectedPixelBlock({
        ...selectedPixelBlock,
        showCoverImgList: newSelectedShowCover,
      });
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
      setSelectedPixelBlock({
        ...selectedPixelBlock,
        showCoverImgList: newArr,
      });
      return newArr;
    });
  };

  return (
    <>
      <ModalBody>
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
        <div className="flex gap-2 mb-2">
          <div
            onClick={() => handlePhotoBtn("landCover")}
            className="w-[60px] h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
          >
            <TbUpload size={30} color="#63727e" />
          </div>
          {selectedPixelBlock.landCoverImg && (
            <div className="relative w-[200px] h-[200px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer">
              <img
                src={selectedPixelBlock.landCoverImg.src}
                alt="Land Cover"
                className="w-full h-full object-cover"
              />
              <TbTrash
                size={20}
                className="absolute opacity-50 bottom-2 right-2 text-[#63727e] cursor-pointer hover:text-red-500 hover:opacity-100"
                onClick={() =>
                  handleDelete(selectedPixelBlock.landCoverImg.id, "landCover")
                }
              />
            </div>
          )}
        </div>

        <span className="text-sm text-gray-500 font-bold">
          展示图 {selectedShowCover.length + "/3"}
        </span>
        <div className="flex gap-2 mb-6">
          <div
            onClick={() => handlePhotoBtn("showCover")}
            className="min-w-[60px] min-h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
          >
            <TbUpload size={30} color="#63727e" />
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedShowCover.map((cover, index) => (
              <div
                key={cover.id}
                className="relative w-full border border-conditionalborder-transparent rounded flex items-center justify-center bg-[#f3f6f8] hover:bg-[#d9d9d9] cursor-pointer"
              >
                <img
                  src={cover.src}
                  alt={`Show Cover ${index}`}
                  className="w-full h-full object-cover"
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
        <span className="text-sm text-gray-500 font-bold">开启外站嵌入</span>
        <div className="flex flex-col  mb-2 items-center justify-center bg-[#f3f6f8]">
          <Switch
            defaultSelected={selectedPixelBlock.useExternalLink}
            onValueChange={(value) => {
              setSelectedPixelBlock({
                ...selectedPixelBlock,
                useExternalLink: value,
              });
            }}
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-[#f3f6f8] hover:border-primary items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                "data-[selected=true]:"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4"
              ),
            }}
          >
            <div className="flex flex-col gap-1 ">
              <p className="text-medium">使用外站链接</p>
              <p className="text-tiny text-default-400">
                Get access to new features before they are released.
              </p>
            </div>
          </Switch>
          {selectedPixelBlock.useExternalLink && (
            <div className="w-full px-6">
              <RadioGroup
                label="提供方"
                value={selectedPixelBlock.externalLinkType}
                onValueChange={(value) => {
                  setSelectedPixelBlock({
                    ...selectedPixelBlock,
                    externalLinkType: value,
                  });
                }}
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

              {selectedPixelBlock.externalLinkType && (
                <div>
                  <span className="text-default-500 text-sm">
                    其提供 {selectedPixelBlock.externalLinkType}{" "}
                    的iframe嵌入代码
                  </span>
                  <Textarea
                    isInvalid={errorExternalLink != null}
                    errorMessage={errorExternalLink}
                    variant="faded"
                    placeholder="拷贝嵌入代码"
                    className="w-full py-2 mb-2"
                    value={externalLinkText || ""}
                    onValueChange={(v) => {
                      setExternalLinkText(v);
                    }}
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </ModalBody>

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
              <Button color="danger" variant="light" onPress={handleCropCancel}>
                取消
              </Button>
              <Button color="primary" onPress={handleCropConfirm}>
                确认裁剪
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

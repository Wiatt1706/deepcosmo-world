import React, { useState } from "react";
import PhotoSlider, { Photo } from "@/components/utils/PhotoGallery";
import styles from "@/styles/canvas/ViewAct.module.css";
import { clsx } from "clsx";
import {
  TbPhotoPlus,
  TbUpload,
  TbTrash,
  TbArrowUp,
  TbArrowDown,
} from "react-icons/tb";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Cropper, { Area } from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";

export default function PhotosModel({ landImgs }: { landImgs?: Photo[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedLandCover, setSelectedLandCover] = useState<Photo | null>(
    null
  );
  const [selectedShowCover, setSelectedShowCover] = useState<Photo[]>([]);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [croppingType, setCroppingType] = useState<
    "landCover" | "showCover" | null
  >(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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
          const newPhoto = { src: url, id: uuidv4() };
          if (croppingType === "landCover") {
            setSelectedLandCover(newPhoto);
          } else if (croppingType === "showCover") {
            setSelectedShowCover((prev) => [...prev, newPhoto]);
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
      setSelectedLandCover(null);
    } else if (type === "showCover") {
      setSelectedShowCover((prev) => prev.filter((photo) => photo.id !== id));
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

  return (
    <>
      <div
        className={clsx(styles["photoSliderContainer"], styles["photoSlider"])}
      >
        {landImgs && landImgs.length > 0 ? (
          <>
            <PhotoSlider photos={landImgs} />
            <button
              className={styles["manageButton"]}
              onClick={() => console.log("Manage images clicked")}
            >
              管理图片
            </button>
          </>
        ) : (
          <div
            onClick={onOpen}
            className="w-full cursor-pointer bg-[#f9f9f9] h-[200px] flex justify-center items-center hover:bg-[#f5f5f5]"
          >
            <TbPhotoPlus size={50} className="text-gray-500" />
          </div>
        )}
      </div>

      <Modal
        backdrop="blur"
        radius="sm"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        classNames={{
          backdrop: "backdrop-blur-sm bg-opacity-70 bg-[#63727e]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                封面管理
              </ModalHeader>
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
                <span className="text-sm text-gray-500 font-bold">
                  土块封面
                </span>
                <div className="flex gap-2 mb-2">
                  <div
                    onClick={() => handlePhotoBtn("landCover")}
                    className="w-[60px] h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center hover:bg-[#f3f6f8] cursor-pointer"
                  >
                    <TbUpload size={30} color="#63727e" />
                  </div>
                  {selectedLandCover && (
                    <div className="relative w-[200px] h-[200px] border border-conditionalborder-transparent rounded flex items-center justify-center hover:bg-[#f3f6f8] cursor-pointer">
                      <img
                        src={selectedLandCover.src}
                        alt="Land Cover"
                        className="w-full h-full object-cover"
                      />
                      <TbTrash
                        size={20}
                        className="absolute opacity-50 bottom-2 right-2 text-[#63727e] cursor-pointer hover:text-red-500 hover:opacity-100"
                        onClick={() =>
                          handleDelete(selectedLandCover.id, "landCover")
                        }
                      />
                    </div>
                  )}
                </div>

                <span className="text-sm text-gray-500 font-bold">
                  展示图 {selectedShowCover.length + "/3"}
                </span>
                <div className="flex gap-2 mb-2">
                  <div
                    onClick={() => handlePhotoBtn("showCover")}
                    className="min-w-[60px] min-h-[60px] border border-conditionalborder-transparent rounded flex items-center justify-center hover:bg-[#f3f6f8] cursor-pointer"
                  >
                    <TbUpload size={30} color="#63727e" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedShowCover.map((cover, index) => (
                      <div
                        key={cover.id}
                        className="relative w-full border border-conditionalborder-transparent rounded flex items-center justify-center hover:bg-[#f3f6f8] cursor-pointer"
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" size="sm" onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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

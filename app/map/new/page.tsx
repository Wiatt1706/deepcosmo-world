// pages/NewMapPage.tsx
"use client";
import { PixelGridBackground } from "@/components/utils/PixelGridBackground";
import { useState, useEffect } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { TbPhoto, TbPlus, TbUpload } from "react-icons/tb";
import { ImgToPixel } from "@/components/map/helpers/ImgToPixel";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";
import { Button } from "@nextui-org/button";
import { Slider } from "@nextui-org/react";
import algorithm from "@/components/map/helpers/algorithm";
import NewMapIndex from "@/components/map/layout/NewMapIndex";
import { Step } from "@/components/utils/Step";

// Constants for controlling the image resolution range
const MIN_WIDTH = 480;
const MAX_WIDTH = 980;
const MIN_HEIGHT = 480;
const MAX_HEIGHT = 980;

export default function NewMapPage() {
  const [imageData, setImageData] = useState<PixelBlock[]>();

  const [currentStep, setCurrentStep] = useState(1);

  const handlePhotoBtn = () => {
    document.getElementById("imageInput")!.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const img = new Image();
          img.src = e.target.result as string;
          img.onload = () => {
            const { width, height } = img;
            if (
              width >= MIN_WIDTH &&
              width <= MAX_WIDTH &&
              height >= MIN_HEIGHT &&
              height <= MAX_HEIGHT
            ) {
              ImgToPixel(img, 20).then((data: PixelBlock[]) => {
                const updatedData = data.map((pixel) => ({
                  ...pixel,
                  groupId: "myLogo",
                }));

                setImageData(updatedData);
                handleNextStep();
              });
            } else {
              alert(
                `图片分辨率必须在 ${MIN_WIDTH}x${MIN_HEIGHT} 和 ${MAX_WIDTH}x${MAX_HEIGHT} 之间，请选择其他图片。`
              );
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      {(currentStep === 1 || currentStep === 2) && (
        <PixelGridBackground
          gridSize={30}
          cloudOpacity={0}
          colors={[
            "rgba(255, 0, 0, 0.5)",
            "rgba(0, 255, 0, 0.5)",
            "rgba(0, 0, 255, 0.5)",
          ]}
          spawnFrequency={1000}
          cellDuration={10000}
          enableAnimation={true}
        />
      )}
      <div className="bg-white rounded shadow-lg z-10">
        <Step stepNumber={1} title="选择模式" currentStep={currentStep}>
          <div className="p-4">
            <div
              className={
                styles["bottom-tool-box"] +
                " px-[100px] cursor-pointer hover:bg-gray-200 "
              }
              onClick={handleNextStep}
            >
              <TbPlus size={25} className="mr-2" /> 创建
            </div>
            <div
              className={
                styles["bottom-tool-box"] +
                " px-[100px] cursor-pointer hover:bg-gray-200"
              }
            >
              <TbUpload size={25} className="mr-2" /> 导入
            </div>
          </div>
        </Step>

        <Step stepNumber={2} title="上传图片" currentStep={currentStep}>
          <div className="p-4">
            <div
              className={
                styles["bottom-tool-box"] +
                " px-[100px] cursor-pointer hover:bg-gray-200 "
              }
              onClick={handlePhotoBtn}
            >
              <TbPhoto size={25} />
            </div>
            <Button size="sm" variant="light" onClick={handleBackStep}>
              上一步
            </Button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </Step>

        <Step stepNumber={3} currentStep={currentStep}>
          <NewMapIndex initData={imageData} />
        </Step>
      </div>
    </div>
  );
}

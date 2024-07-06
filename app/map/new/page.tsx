// pages/NewMapPage.tsx
"use client";
import { PixelGridBackground } from "@/components/utils/PixelGridBackground";
import { useState, useEffect } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { TbPhoto } from "react-icons/tb";
import { ImgToPixel } from "@/components/map/helpers/ImgToPixel";
import ShowMapCanvas from "@/components/map/ShowMapCanvas";
import { PixelBlock } from "@/types/MapTypes";

// Constants for controlling the image resolution range
const MIN_WIDTH = 480;
const MAX_WIDTH = 980;
const MIN_HEIGHT = 480;
const MAX_HEIGHT = 980;

export default function NewMapPage() {
  const [imageData, setImageData] = useState<PixelBlock[]>();
  const [windowDimensions, setWindowDimensions] = useState({
    width: Math.min(window.innerWidth, 800),
    height: Math.min(window.innerHeight, 800),
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: Math.min(window.innerWidth, 800),
        height: Math.min(window.innerHeight, 800),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                setImageData(data);
                setCurrentStep(2); // Move to step 3 after image processing
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

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      <PixelGridBackground
        gridSize={50}
        cloudOpacity={0}
        colors={[
          "rgba(255, 0, 0, 0.5)",
          "rgba(0, 255, 0, 0.5)",
          "rgba(0, 0, 255, 0.5)",
        ]}
        spawnFrequency={2000}
        cellDuration={10000}
        enableAnimation={true}
      />
      <div className="p-4 bg-white rounded shadow-lg z-10">
        <h1 className="text-2xl font-bold">步骤导航</h1>

        <Step stepNumber={1} title="1、选择你的logo" currentStep={currentStep}>
          <div className={styles["bottom-tool-box"]} onClick={handlePhotoBtn}>
            <TbPhoto size={25} />
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </Step>

        <Step stepNumber={2} title="2、上传图片" currentStep={currentStep}>
          {imageData && (
            <ShowMapCanvas
              initData={imageData}
              containerWidth={windowDimensions.width - 40}
              containerHeight={windowDimensions.height - 40}
            />
          )}
          <button onClick={() => setCurrentStep(1)}>上一步</button>
        </Step>

        <Step stepNumber={3} title="3、显示地图" currentStep={currentStep}>
          <button onClick={() => setCurrentStep(2)}>上一步</button>
        </Step>

       
      </div>
    </div>
  );
}

interface StepProps {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
  currentStep: number;
}

const Step: React.FC<StepProps> = ({
  stepNumber,
  title,
  children,
  currentStep,
}) => {
  if (currentStep !== stepNumber) {
    return null;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

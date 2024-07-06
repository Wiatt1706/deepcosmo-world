"use client";
import React, { useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { TbArrowBackUp, TbArrowForwardUp, TbPhoto } from "react-icons/tb";
import { ImgToPixel } from "../helpers/ImgToPixel";
import { useMapStore } from "../SocketManager";

export const BottomToolView: React.FC = () => {
  const [imageData, setImageData] = useState<any>(null);
  const [pixelBlocks, setPixelBlocks] = useMapStore((state: any) => [
    state.pixelBlocks,
    state.setPixelBlocks,
  ]);
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
            ImgToPixel(img, 20).then((data) => {
              setImageData(data);
              setPixelBlocks(data);
            });
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={styles["bottom-tool"]}>
        <div className="flex items-center px-2 ">
          <div className={styles["bottom-tool-box"]}>
            <TbArrowBackUp size={25} />
          </div>

          <div className={styles["bottom-tool-box"]}>
            <TbArrowForwardUp size={25} />
          </div>

          <div className={styles["bottom-tool-box"]} onClick={handlePhotoBtn}>
            <TbPhoto size={25} />
          </div>
        </div>
      </div>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </>
  );
};

import React, { useRef, ChangeEvent, useState } from "react";
import { BiImage } from "react-icons/bi";
import styles from "./ImageModule.module.css";
import { clsx } from "clsx";

interface ImageModuleProps {
  className?: string;
  maxFileSize?: number;
  onChange?: (imageElement: HTMLImageElement | null) => void;
}

const ImageModule: React.FC<ImageModuleProps> = ({
  className,
  maxFileSize = 5 * 1024 * 1024, // Default maximum file size (5MB)
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > maxFileSize) {
      alert("文件太大，请选择小于5MB的图片文件。");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.src = event.target.result as string;

        img.onload = () => {
          setIsUploading(false);
          if (onChange) {
            onChange(img);
          }
        };
      } else {
        // Handle the case where reader.result is undefined
        console.error("Error reading the file.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && isImageFile(file)) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file && isImageFile(file)) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const isImageFile = (file: File) => {
    const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    return acceptedImageTypes.includes(file.type);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleAddImage}
      className={clsx(className, styles["col-imgbox"]) + " d_c_c_c"}
    >
      <BiImage />
      <span>
        Drag image or <label>Browse</label>
      </span>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".jpg, .jpeg, .png, .gif"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageModule;

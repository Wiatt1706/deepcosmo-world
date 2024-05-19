
import React, { useRef, useState } from "react";
import { ImagePlus, Loader2 } from 'lucide-react';
import { BlockButton } from '@/components/assembly/DLCModule';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

export default function ImageBtn({ handleSelect, uploadImgSeting = {
    maxSize: MAX_FILE_SIZE_BYTES,
    allowMultiple: false,
    maxFileCount: MAX_FILES
} }) {
    const {
        maxSize = MAX_FILE_SIZE_BYTES,
        allowMultiple = false,
        maxFileCount = MAX_FILES
    } = uploadImgSeting;

    const imageButtonRef = useRef(null);
    const fileInputRef = useRef(null); // 用于处理文件输入

    const [isUploading, setIsUploading] = useState(false); // 添加一个状态来跟踪上传状态
    // 处理点击添加图片的函数
    const handleAddImage = () => {
        // 触发文件输入框的点击事件
        fileInputRef.current.click();
    };

    // 处理文件选择的函数
    const handleFileSelect = async (event) => {
        const selectedFiles = event.target.files
        if (allowMultiple && selectedFiles.length > maxFileCount) {
            alert(`超过最大允许文件数量（${maxFileCount}）。请最多选择 ${maxFileCount} 个文件。`);
            return;
        }
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            // 检查文件大小是否超过阈值
            if (isImageFile(file)) {
                if (file.size > maxSize) {
                    alert("文件太大，请选择小于5MB的图片文件。");
                    return;
                }
            } else {
                // 提示用户选择正确类型的文件
                alert("请选择图片文件（例如：.jpg、.png、.gif 等）");
                return;
            }
        }

        handleSelect(selectedFiles)
    };


    const isImageFile = (file) => {
        const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"]; // 支持的图片文件类型
        return acceptedImageTypes.includes(file.type);
    };

    return (
        <div >
            {/* 添加图片按钮 */}
            {isUploading ? (
                <BlockButton value={<Loader2 />} autoRotate={true} />
            ) : (
                <BlockButton value={<ImagePlus />} btnRef={imageButtonRef} onClick={handleAddImage} />
            )}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".jpg, .jpeg, .png, .gif"
                multiple={allowMultiple}
                onChange={handleFileSelect}
            />
        </div>

    );
}


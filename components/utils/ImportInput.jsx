import React, { useRef, useImperativeHandle } from "react";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 5;

const ImportInput = React.forwardRef(
  (
    {
      handleSelect,
      accept = ".glb",
      isFileValid = (file) => true, // 默认文件验证函数，接受所有文件
      errorMessage = "请选择文件", // 默认错误提示信息
      uploadFileSetting = {
        maxSize: MAX_FILE_SIZE_BYTES,
        allowMultiple: false,
        maxFileCount: MAX_FILES,
      },
    },
    ref
  ) => {
    const {
      maxSize = MAX_FILE_SIZE_BYTES,
      allowMultiple = false,
      maxFileCount = MAX_FILES,
    } = uploadFileSetting;

    const fileInputRef = useRef(null);

    const handleFileInput = async (event) => {
      const selectedFiles = event.target.files;
      if (selectedFiles.length > maxFileCount) {
        alert(
          `超过最大允许文件数量（${maxFileCount}）。请最多选择 ${maxFileCount} 个文件。`
        );
        return;
      }
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // 检查文件大小是否超过阈值
        if (isFileValid(file)) {
          if (file.size > maxSize) {
            alert(`文件大小不能超过 ${maxSize / 1024 / 1024} MB。`);
            return;
          }
        } else {
          // 提示用户选择正确类型的文件
          alert(errorMessage);
          return;
        }
      }

      handleSelect(selectedFiles);
    };

    // 使用 useImperativeHandle 向父组件暴露 fileInputRef 的点击方法
    useImperativeHandle(ref, () => ({
      clickFileInput: () => {
        fileInputRef.current.click();
      },
    }));

    return (
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept}
        multiple={allowMultiple}
        onChange={handleFileInput}
      />
    );
  }
);

ImportInput.displayName = "ImportInput";
export default ImportInput;

import React, { useState, useEffect } from "react";
import { clsx } from "clsx";

interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  readOnly?: boolean;
}

const normalizeColor = (color?: string) => {
  if (color) {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.fillStyle = color;
      return ctx.fillStyle;
    }
  }

  return "#000000"; // 默认颜色，避免异常
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value: initialValue,
  onChange,
  className,
  readOnly = false,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);

  useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedColor = normalizeColor(e.target.value);
    setInternalValue(normalizedColor);
    onChange({ ...e, target: { ...e.target, value: normalizedColor } });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange(e);
  };

  const handleBlur = () => {
    const normalizedColor = normalizeColor(internalValue);
    setInternalValue(normalizedColor);
    onChange({
      target: { value: normalizedColor },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className={clsx(className, "w-full flex items-center justify-between")}
    >
      <span className="px-[5px] mr-1">{label}</span>
      <div className="flex p-1 bg-[#f3f6f8] rounded-[50px] items-center w-full text-[12px] font-[400] ">
        <input
          aria-label="Color picker"
          className="bg-transparent text-overflow-ellipsis border-none w-full pl-2 focus:outline-none focus:ring-0"
          type="text"
          readOnly={readOnly}
          value={internalValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
        />
        <input
          aria-label="Color picker"
          className="color-picker min-w-[24px] min-h-[24px]  w-[24px] h-[24px]  border-none cursor-pointer p-0 rounded-[32px]"
          type="color"
          value={internalValue}
          onChange={handleColorChange}
        />
      </div>
      <style jsx>{`
        .color-picker {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .color-picker::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-picker::-webkit-color-swatch {
          border: none;
          border-radius: 32px;
        }
      `}</style>
    </div>
  );
};

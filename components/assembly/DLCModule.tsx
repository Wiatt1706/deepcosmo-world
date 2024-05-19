import React, { useEffect, useRef, useState, useId } from "react";
import blockButtonStyles from "./BlockButton.module.css";
import styles from "./DLCModule.module.css";
import { clsx } from "clsx";
import ImageModule from "./ImageModule";

interface BlockButtonProps {
  btnRef?: React.RefObject<HTMLButtonElement>;
  value: React.ReactNode;
  onClick?: () => void;
  className?: string;
  autoRotate?: boolean;
  width?: string;
  height?: string;
}

export const BlockButton: React.FC<BlockButtonProps> = ({
  btnRef,
  value,
  onClick,
  className,
  width = "35px",
  height = "35px",
  autoRotate = false,
}) => {
  return (
    <button
      ref={btnRef}
      className={clsx(
        className,
        blockButtonStyles["tooltip-icon-button"],
        autoRotate ? blockButtonStyles.btnRotate : ""
      )}
      style={{ minWidth: width, minHeight: height }} // 使用行内样式设置宽度和高度
      onClick={onClick}
    >
      {value}
    </button>
  );
};

interface InputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  inputRef?: React.RefObject<HTMLInputElement>;
  value?: any;
  width?: string;
  postfix?: string;
  placeholder?: string; // 新增的 placeholder 属性
  className?: string;
  type?: "text" | "number" | "color";
  readOnly?: boolean;
  onChange?: (value: any) => void;
}

export const Input: React.FC<InputProps> = ({
  inputRef,
  value,
  width,
  postfix,
  placeholder,
  className,
  type,
  readOnly = false,
  onChange,
}) => {
  const inputType = type || "text";
  const inputMode = type === "number" ? "numeric" : "text";

  const inputStyle = {
    width: width ? (width.endsWith("px") ? width : `${width}px`) : "100%",
    cursor: readOnly ? "default" : "auto",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div
      className={clsx(
        className,
        styles["col-input"],
        !readOnly && !className ? styles["editable"] : ""
      )}
    >
      <input
        inputMode={inputMode}
        type={inputType}
        onChange={handleInputChange}
        ref={inputRef}
        style={inputStyle}
        value={value || ""}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      {postfix && <label>{postfix}</label>}
    </div>
  );
};

interface SwitchBlockProps {
  value: string;
  offText?: string;
  onText?: string;
  className?: string;
  onChange: (value: any) => void;
}

export const SwitchBlock: React.FC<SwitchBlockProps> = ({
  value,
  offText = "Off",
  onText = "On",
  className,
  onChange,
}) => {
  const [isOff, setIsOff] = useState(value === offText);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value === onText ? offText : onText);
    }
  };

  useEffect(() => {
    setIsOff(value === offText);
  }, [value, offText]);

  return (
    <div className={clsx(className, styles["col-switch"])}>
      <input
        type="radio"
        className={styles["switch-input"]}
        name="switchBlock"
        value={offText}
        id="OffID"
        checked={!isOff}
        onChange={handleInputChange}
      />
      <label
        htmlFor="OffID"
        className={clsx([styles["switch-label"], styles["switch-label-off"]])}
      >
        Off
      </label>

      <input
        type="radio"
        className={styles["switch-input"]}
        name="switchBlock"
        value={onText}
        id="OnID"
        checked={isOff}
        onChange={handleInputChange}
      />
      <label
        htmlFor="OnID"
        className={clsx([styles["switch-label"], styles["switch-label-on"]])}
      >
        On
      </label>

      <span className={styles["switch-selection"]}></span>
    </div>
  );
};

interface ButtonProps {
  btnRef?: React.RefObject<HTMLButtonElement>;
  text: React.ReactNode;
  onClick?: () => void;
  autoRotate?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  btnRef,
  text,
  onClick,
  autoRotate = false,
  className,
}) => {
  return (
    <button
      ref={btnRef}
      className={clsx(
        styles["button"],
        autoRotate ? styles.btnRotate : "",
        className || ""
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

interface CheckboxProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  text?: string;
  checked: boolean;
  readOnly?: boolean;
  onChange?: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  inputRef,
  className,
  text,
  checked,
  readOnly = false,
  onChange,
}) => {
  const handleInputChange = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  const id = useId(); // 生成稳定id

  return (
    <div
      className={clsx(
        className,
        styles["col-checkbox"],
        !readOnly ? styles["editable"] : ""
      )}
    >
      <input
        id={id}
        type="checkbox"
        onChange={handleInputChange}
        ref={inputRef}
        checked={checked}
        readOnly={readOnly}
      />
      <label htmlFor={id}>
        <span>{text}</span>
      </label>
    </div>
  );
};

interface Option {
  value: string;
  name: string;
}

interface SelectProps
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "onChange"
  > {
  selectRef?: React.RefObject<HTMLSelectElement>;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  width?: string;
  readOnly?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  selectRef,
  options,
  value,
  onChange,
  width,
  readOnly,
  ...rest
}) => {
  const selectStyle = {
    width: width ? (width.endsWith("px") ? width : `${width}px`) : "100%",
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  // 如果设置为只读，渲染一个类似 Input 的输入框
  if (readOnly) {
    // 查找匹配的 Option 对象
    const selectedOption = options.find((option) => option.value === value);

    return <Input readOnly value={selectedOption?.name || ""} />;
  }

  return (
    <div
      className={clsx(
        rest.className,
        styles["col-select"],
        !rest.className ? styles["editable"] : ""
      )}
      style={selectStyle}
    >
      <select
        {...rest}
        onChange={handleSelectChange}
        ref={selectRef}
        style={selectStyle}
        value={value || ""}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value || ""}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ImageModule };

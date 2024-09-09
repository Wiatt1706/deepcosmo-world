"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import styles from "./NumInput.module.css";
import { clsx } from "clsx";

interface NumInputProps {
  minValue?: number;
  maxValue?: number;
  prefix?: ReactNode; // Updated to ReactNode
  suffix?: ReactNode; // Updated to ReactNode
  value?: number;
  precision?: number;
  onUpdate: (newValue: number) => void;
  step?: number;
  className?: string;
  readOnly?: boolean; // New readOnly prop
}

export const NumInput: React.FC<NumInputProps> = ({
  minValue = -Infinity,
  maxValue = Infinity,
  prefix = "", // Defaults to an empty string, but can now accept elements
  suffix = "", // Defaults to an empty string, but can now accept elements
  value = 0,
  precision = 2,
  onUpdate,
  step = 1,
  className = "",
  readOnly = false, // Defaults to false (editable)
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const numInputRef = useRef<HTMLDivElement>(null);

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const [text, setText] = useState(parseFloat(value.toFixed(precision)));
  const [editing, setEditing] = useState(false);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (readOnly) return; // Prevent wheel increment in read-only mode
    const direction = event.deltaY > 0 ? 1 : -1;
    updateValue(direction * step);
  };

  const handleIncrement = () => {
    if (readOnly) return; // Prevent increment in read-only mode
    updateValue(step);
  };

  const handleDecrement = () => {
    if (readOnly) return; // Prevent decrement in read-only mode
    updateValue(-step);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setText(newValue);
    }
  };

  const handleInputBlur = () => {
    const newValue = Math.min(Math.max(text, minValue), maxValue);
    setText(parseFloat(newValue.toFixed(precision)));
    onUpdate(newValue);
    setEditing(false);
  };

  const updateValue = (delta: number) => {
    const newValue = Math.min(Math.max(text + delta, minValue), maxValue);
    setText(parseFloat(newValue.toFixed(precision)));
    onUpdate(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return; // Prevent dragging in read-only mode

    dragStartX.current = e.clientX;
    isDragging.current = true;
    hasMoved.current = false;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "none";
    if (numInputRef.current) {
      numInputRef.current.style.cursor = "none";
      numInputRef.current.style.backgroundColor = "lightblue";
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || readOnly) return;

    if (dragStartX.current !== null) {
      const deltaX = e.clientX - dragStartX.current;
      const deltaValue = deltaX * step;
      updateValue(deltaValue);
      hasMoved.current = true;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    document.body.style.cursor = "auto";
    if (numInputRef.current) {
      numInputRef.current.style.cursor = "auto";
      numInputRef.current.style.backgroundColor = "initial";
    }
    if (!hasMoved.current && !readOnly) {
      setEditing(true);
    }
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setText(parseFloat(value.toFixed(precision)));
  }, [value]);

  return (
    <div
      className={clsx(styles.numInput, className, readOnly && styles.readOnly)} // Optional read-only styling
      onWheel={(e) => handleWheel(e)}
      ref={numInputRef}
    >
      {!editing ? (
        <>
          <div className={styles.btn} onClick={handleDecrement}>
            <BiChevronLeft />
          </div>
          <div
            className={styles.text}
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseUp={handleMouseUp}
          >
            <div>{prefix}</div> {/* Supports elements as prefix */}
            <span>{text.toFixed(precision)}</span>
            <div>{suffix}</div>
            {/* Supports elements as suffix */}
          </div>
          <div className={styles.btn} onClick={handleIncrement}>
            <BiChevronRight />
          </div>
        </>
      ) : (
        <input
          ref={inputRef}
          type="number"
          value={text}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={readOnly} // Disable input in read-only mode
        />
      )}
    </div>
  );
};

const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;

interface DegreeNumInputProps {
  value: number;
  onUpdate: (newValue: number) => void;
  prefix?: ReactNode; // Updated to ReactNode
  suffix?: ReactNode; // Updated to ReactNode
  step?: number;
  className?: string;
  readOnly?: boolean; // New readOnly prop
}

export const DegreeNumInput: React.FC<DegreeNumInputProps> = ({
  value,
  onUpdate,
  prefix,
  suffix,
  step,
  className,
  readOnly,
}) => {
  const [inputValue, setInputValue] = useState(radiansToDegrees(value));

  const handleChange = (newValue: number) => {
    setInputValue(newValue);
    onUpdate(newValue * (Math.PI / 180));
  };

  return (
    <NumInput
      value={inputValue}
      onUpdate={handleChange}
      prefix={prefix}
      suffix={suffix}
      step={step}
      className={className}
      readOnly={readOnly} // Pass readOnly prop down
    />
  );
};

"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const NumInput = ({
  minValue = -Infinity,
  maxValue = Infinity,
  prefix = "",
  suffix = "",
  value = 0,
  precision = 2,
  onUpdate = () => {},
  step = 1, // 新增的参数，默认值为1
}) => {
  const inputRef = useRef(null);
  const numInputRef = useRef(null);

  const dragStartX = useRef(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const [text, setText] = useState(parseFloat(value.toFixed(precision)));
  const [editing, setEditing] = useState(false);

  const handleWheel = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    updateValue(direction * step);
  };

  const handleIncrement = () => {
    updateValue(step);
  };

  const handleDecrement = () => {
    updateValue(-step);
  };

  const handleInputChange = (event) => {
    // 在输入框中直接编辑时，确保只输入合法数字
    const newValue = parseFloat(event.target.value);

    if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
      setText(newValue);
      onUpdate(newValue);
    }
  };

  const handleInputBlur = () => {
    setEditing(false);
  };

  const updateValue = (delta) => {
    const newValue = Math.min(Math.max(text + delta, minValue), maxValue);
    setText(parseFloat(newValue.toFixed(precision)));
    onUpdate(newValue);
  };

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    hasMoved.current = false;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "none";
    numInputRef.current.style.cursor = "none";
    numInputRef.current.style.backgroundColor = "lightblue"; // Change this to your desired color
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStartX.current;
    const deltaValue = deltaX * step; // Adjust the divisor for sensitivity
    updateValue(deltaValue);
    hasMoved.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    document.body.style.cursor = "auto";
    numInputRef.current.style.cursor = "auto";
    numInputRef.current.style.backgroundColor = "initial"; // Change this to the default background color
    if (!hasMoved.current) {
      setEditing(true);
    }
  };

  useEffect(() => {
    // 在组件渲染后自动聚焦到输入框
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setText(parseFloat(value.toFixed(precision)));
  }, [value]);

  return (
    <div className="numInput" onWheel={(e) => handleWheel(e)} ref={numInputRef}>
      {!editing ? (
        <>
          <div className="btn" onClick={handleDecrement}>
            <BiChevronLeft />
          </div>
          <div
            className="text"
            onMouseDown={(e) => handleMouseDown(e)} // Add this line
            onMouseUp={handleMouseUp} // Add this line
          >
            <span>{prefix}</span>
            <span>
              {text.toFixed(precision)} {suffix}
            </span>
          </div>
          <div className="btn" onClick={handleIncrement}>
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
        />
      )}
    </div>
  );
};

export default NumInput;

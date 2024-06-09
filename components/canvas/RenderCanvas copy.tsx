"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, Position, Character } from "@/types/CanvasTypes";
import { drawCircle, applySectorLight } from "./helpers/BaseDraw";
import useKeyPress from "../hook/useKeyPress";

export const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const firmRef = useRef<HTMLCanvasElement | null>(null);
  const actRef = useRef<HTMLCanvasElement | null>(null);

  const [pos, setPos] = useState<Character>({
    x: 100,
    y: 100,
    angle: 0,
    speed: 5,
  });

  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // 按键监听
  useKeyPress(setKeys);

  // 初始化活动画布
  const initActCanavas = (centrePos: Position) => {
    const container = containerRef.current;
    const canvas = actRef.current;
    if (!container || !canvas) {
      return;
    }
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // 绘制角色运动半径
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    drawCircle(ctx, centrePos.x, centrePos.y, 50, "gray", 0.5);
  };

  // 初始化坚固画布
  const initFirmCanavas = () => {
    const firmCanvas = firmRef.current;
    if (!firmCanvas) {
      return;
    }
    const firmCtx = firmCanvas.getContext("2d");

    if (firmCtx) {
      const img = new Image();
      img.src = "/images/pixel_map_1.jpg";
      img.onload = () => {
        firmCtx.clearRect(0, 0, firmCanvas.width, firmCanvas.height);
        firmCtx.drawImage(img, 0, 0);

        applySectorLight(firmCtx, pos.x, pos.y, 100, 60, 270, lightIntensity);
      };
    }
  };

  // 初次加载
  useEffect(() => {
    const initializeCanvasSize = (): void => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      if (!container || !renderCanvas) {
        return;
      }
      const centrePos = {
        x: container.clientWidth / 2,
        y: container.clientHeight - 100,
      };

      renderCanvas.width = container.clientWidth;
      renderCanvas.height = container.clientHeight;

      initActCanavas(centrePos);
      initFirmCanavas();
      render();
    };
    initializeCanvasSize();
  }, [containerRef, renderRef]);

  // 鼠标拖拽事件处理
  useEffect(() => {
    let isDragging = false;
    let initialAngle = 0;
    let startX = 0;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      startX = event.clientX;
      initialAngle = pos.angle;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = ((event.clientX - startX) / 10) * mouseSensitivity;
        setPos((prevPos) => ({
          ...prevPos,
          angle: initialAngle + deltaX,
        }));
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [pos.angle]);

  // 移动角色
  useEffect(() => {
    const moveCharacter = () => {
      setPos((prevPos) => {
        let { x, y, angle, speed } = prevPos;
        let moveX = 0;
        let moveY = 0;

        const radian = (angle * Math.PI) / 180; // 将角度转换为弧度

        if (keys.up) {
          moveX += -Math.sin(radian);
          moveY += -Math.cos(radian);
        }
        if (keys.down) {
          moveX += Math.sin(radian);
          moveY += Math.cos(radian);
        }
        if (keys.left) {
          moveX += -Math.cos(radian);
          moveY += Math.sin(radian);
        }
        if (keys.right) {
          moveX += Math.cos(radian);
          moveY += -Math.sin(radian);
        }

        // 计算总移动矢量的长度
        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
          // 归一化移动矢量并按速度缩放
          moveX = (moveX / length) * speed;
          moveY = (moveY / length) * speed;
        }

        x += moveX;
        y += moveY;

        return { ...prevPos, x, y };
      });
    };

    const intervalId = setInterval(moveCharacter, 16); // 大约每秒 60 帧
    return () => clearInterval(intervalId);
  }, [keys]);

  useEffect(() => {
    render();
  }, [pos]);

  const render = () => {
    const renderCanvas = renderRef.current;
    const firmCanvas = firmRef.current;
    const actCanvas = actRef.current;
    if (!renderCanvas || !firmCanvas || !actCanvas) {
      return;
    }
    const renderCtx = renderCanvas.getContext("2d");

    if (!renderCtx) {
      return;
    }

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;

    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((pos.angle * Math.PI) / 180);
    renderCtx.drawImage(firmCanvas, -pos.x, -pos.y);
    renderCtx.restore();

    renderCtx.drawImage(actCanvas, 0, 0);
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} style={{ background: "#272727" }} />
      <canvas ref={actRef} style={{ display: "none" }} />
      <canvas
        style={{ display: "none" }}
        ref={firmRef}
        width={width}
        height={height}
      />
      <div className={styles["canvas-info"]}>
        <p> {pos.x}</p>
        <p> {pos.y}</p>
        <p> {pos.angle}</p>
      </div>
    </div>
  );
};

export default RenderCanvas;

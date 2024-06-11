"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, Position, Character } from "@/types/CanvasTypes";
import {
  detectLightCollision,
  drawCircle,
  drawCircularLight,
  drawSectorLight,
  handleCollision,
} from "./helpers/BaseDraw";
import useKeyPress from "../hook/useKeyPress";

export const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<HTMLCanvasElement | null>(null);
  const firmRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);
  const actRef = useRef<HTMLCanvasElement | null>(null);

  const [pos, setPos] = useState<Character>({
    x: 125,
    y: 125,
    radius: 50,
    angle: 0,
    speed: 2,
    velocityX: 0,
    velocityY: 0,
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
    drawCircle(ctx, centrePos.x, centrePos.y, pos.radius, "gray", 0.5);
  };

  // 初始化灯光画布
  const initLightCanavas = (centrePos: Position) => {
    const container = containerRef.current;
    const canvas = lightRef.current;
    if (!container || !canvas) {
      return;
    }
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    // 开启遮罩层
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 绘制圆形灯光
    drawCircularLight(ctx, centrePos.x, centrePos.y, 200);
    // 绘制扇形灯光
    drawSectorLight(
      ctx,
      centrePos.x,
      centrePos.y,
      (Math.PI / 3) * 0.9,
      -Math.PI / 2,
      600
    );
  };

  // 初始化地图画布
  const initMapCanavas = () => {
    const canvas = mapRef.current;
    const firmCanvas = firmRef.current;
    if (!canvas || !firmCanvas) {
      return;
    }
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const img = new Image();
      img.src = "/images/pixel_map_1.jpg";
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(firmCanvas, 0, 0);
      };
    }
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
      img.src = "/images/image.png";
      img.onload = () => {
        firmCtx.clearRect(0, 0, firmCanvas.width, firmCanvas.height);
        firmCtx.drawImage(img, 0, 0);
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
      initLightCanavas(centrePos);
      initFirmCanavas();
      initMapCanavas();
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
          angle: initialAngle - deltaX,
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
    const renderCanvas = renderRef.current;
    const firmCanvas = firmRef.current;
    const mapCanvas = mapRef.current;
    const actCanvas = actRef.current;
    const lightCanvas = lightRef.current;
    if (
      !renderCanvas ||
      !firmCanvas ||
      !actCanvas ||
      !lightCanvas ||
      !mapCanvas
    ) {
      return;
    }
    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;
    const renderCtx = renderCanvas.getContext("2d");
    const firmCtx = firmCanvas.getContext("2d");
    const mapCtx = mapCanvas.getContext("2d");
    const actCtx = actCanvas.getContext("2d");
    const lightCtx = lightCanvas.getContext("2d");
    if (!renderCtx || !firmCtx || !actCtx || !lightCtx || !mapCtx) {
      return;
    }

    const moveCharacter = () => {
      setPos((prevPos: Character) => {
        let { x, y, angle, speed, velocityX, velocityY } = prevPos;
        let moveX = 0;
        let moveY = 0;

        const radian = (angle * Math.PI) / 180;

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

        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
          moveX = (moveX / length) * speed;
          moveY = (moveY / length) * speed;
        }

        velocityX += moveX;
        velocityY += moveY;

        const friction = 0.6;
        velocityX *= friction;
        velocityY *= friction;

        const {
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
        } = handleCollision(
          actCtx,
          centerX,
          centerY,
          firmCtx,
          x,
          y,
          pos.radius,
          velocityX,
          velocityY
        );

        return {
          ...prevPos,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
        };
      });
    };

    const intervalId = setInterval(moveCharacter, 16);
    return () => clearInterval(intervalId);
  }, [keys, pos.radius]);

  useEffect(() => {
    render();
  }, [pos]);

  // 处理灯光射线
  useEffect(() => {}, [pos.y, pos.x, pos.angle]);

  const render = () => {
    const renderCanvas = renderRef.current;
    const mapCanvas = mapRef.current;
    const actCanvas = actRef.current;
    const lightCanvas = lightRef.current;
    if (!renderCanvas || !mapCanvas || !actCanvas || !lightCanvas) {
      return;
    }
    const renderCtx = renderCanvas.getContext("2d");
    const mapCtx = mapCanvas.getContext("2d");
    const actCtx = actCanvas.getContext("2d");
    const lightCtx = lightCanvas.getContext("2d");

    if (!renderCtx || !mapCtx || !actCtx || !lightCtx) {
      return;
    }
    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;

    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((pos.angle * Math.PI) / 180);
    renderCtx.drawImage(mapCanvas, -pos.x, -pos.y);
    renderCtx.restore();

    renderCtx.drawImage(lightCanvas, 0, 0);
    renderCtx.drawImage(actCanvas, 0, 0);
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} style={{ background: "black" }} />
      <canvas ref={actRef} style={{ display: "none" }} />
      <canvas ref={lightRef} style={{ display: "none" }} />
      <canvas
        style={{ display: "none" }}
        ref={mapRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={firmRef}
        width={width}
        height={height}
      />
      <div
        className={styles["canvas-info"]}
      >{`x: ${pos.x}, y: ${pos.y}, angle: ${pos.angle}`}</div>
    </div>
  );
};

export default RenderCanvas;

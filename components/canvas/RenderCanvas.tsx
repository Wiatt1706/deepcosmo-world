"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, Character } from "@/types/CanvasTypes";
import { drawViewpoints, getSightPolygon } from "./helpers/LightDraw";
import useKeyPress from "../hook/useKeyPress";

const segments = [
  // Border
  { a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
  { a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
  { a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
  { a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },

  // Polygon #1
  { a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
  { a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
  { a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
  { a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },

  // Polygon #2
  { a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
  { a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
  { a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },

  // Polygon #3
  { a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
  { a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
  { a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
  { a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },

  // Polygon #4
  { a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
  { a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
  { a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },

  // Polygon #5
  { a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
  { a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
  { a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
  { a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },

  // Polygon #6
  { a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
  { a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
  { a: { x: 480, y: 150 }, b: { x: 400, y: 95 } },
];

const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const foregroundRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);

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

  useKeyPress(setKeys);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      const foregroundCanvas = foregroundRef.current;
      if (!container || !renderCanvas || !foregroundCanvas) return;

      renderCanvas.width = container.clientWidth;
      renderCanvas.height = container.clientHeight;

      const foregroundCtx = foregroundCanvas.getContext("2d");
      if (foregroundCtx) {
        const img = new Image();
        img.src = "/images/pixel_map_1.jpg";
        img.onload = () => {
          foregroundCtx.drawImage(img, 0, 0);
          foregroundCtx.strokeStyle = "#fff";
          segments.forEach((seg) => {
            foregroundCtx.beginPath();
            foregroundCtx.moveTo(seg.a.x, seg.a.y);
            foregroundCtx.lineTo(seg.b.x, seg.b.y);
            foregroundCtx.stroke();
          });
        };
      }
    };
    initializeCanvasSize();
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      let startX = event.clientX;
      let initialAngle = pos.angle;

      const handleMouseMove = (event: MouseEvent) => {
        const deltaX = ((event.clientX - startX) / 10) * mouseSensitivity;
        setPos((prevPos) => ({
          ...prevPos,
          angle: initialAngle - deltaX,
        }));
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [pos.angle]);

  useEffect(() => {
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

        velocityX = velocityX * 0.5 + moveX;
        velocityY = velocityY * 0.5 + moveY;

        let newX = x + velocityX;
        let newY = y + velocityY;

        return {
          ...prevPos,
          x: newX,
          y: newY,
          velocityX: velocityX,
          velocityY: velocityY,
        };
      });
    };

    const intervalId = setInterval(moveCharacter, 16);
    return () => clearInterval(intervalId);
  }, [keys]);

  const render = useCallback(() => {
    const renderCanvas = renderRef.current;

    const buffCanvas = buffRef.current;
    if (!renderCanvas || !buffCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    const buffCtx = buffCanvas.getContext("2d");
    if (!renderCtx || !buffCtx) return;

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;

    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((pos.angle * Math.PI) / 180);
    renderCtx.drawImage(buffCanvas, -pos.x, -pos.y);
    renderCtx.restore();
  }, [pos]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, render]);

  const drawLight = useCallback(() => {
    const buffCanvas = buffRef.current;
    const lightCanvas = lightRef.current;
    const foregroundCanvas = foregroundRef.current;
    if (!buffCanvas || !lightCanvas || !foregroundCanvas) return;

    const lightCtx = lightCanvas.getContext("2d");
    const buffCtx = buffCanvas.getContext("2d");
    if (!lightCtx || !buffCtx) return;
    lightCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);

    const polygons = [getSightPolygon(segments, pos.x, pos.y)];

    lightCtx.fillStyle = "rgba(0, 0, 0, 0.9)";
    lightCtx.fillRect(0, 0, buffCanvas.width, buffCanvas.height);

    // 绘制圆形视图
    drawViewpoints(lightCtx, polygons, "circular", {
      x: pos.x,
      y: pos.y,
      radius: 100,
    });

    // 绘制扇形视图
    drawViewpoints(lightCtx, polygons, "sector", {
      x: pos.x,
      y: pos.y,
      radius: 500,
      angle: Math.PI / 3,
      direction: -(pos.angle * Math.PI) / 180 - Math.PI / 2,
    });

    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    buffCtx.drawImage(foregroundCanvas, 0, 0);
    buffCtx.drawImage(lightCanvas, 0, 0);
  }, [pos]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(drawLight);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos.x, pos.y, pos.angle, drawLight]);

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} />
      <canvas
        style={{ display: "none" }}
        ref={buffRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={foregroundRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={lightRef}
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

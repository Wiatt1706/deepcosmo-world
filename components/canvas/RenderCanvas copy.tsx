"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, Character, Geometry } from "@/types/CanvasTypes";
import { drawCharacterViewpoints } from "./helpers/LightDraw";
import useKeyPress from "../hook/useKeyPress";
import { handleCollision } from "@/components/canvas/helpers/PhysicsDraw";

const GeometryList: Geometry[] = [
  {
    name: "Border",
    type: 1,
    segments: [
      { a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
      { a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
      { a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
      { a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },
    ],
  },
  {
    name: "Polygon #1",
    type: 0,
    segments: [
      { a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
      { a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
      { a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
      { a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },
    ],
  },
  {
    name: "Polygon #2",
    type: 0,
    segments: [
      { a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
      { a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
      { a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },
    ],
  },
  {
    name: "Polygon #3",
    type: 0,
    segments: [
      { a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
      { a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
      { a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
      { a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },
    ],
  },
  {
    name: "Polygon #4",
    type: 0,
    segments: [
      { a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
      { a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
      { a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },
    ],
  },
  {
    name: "Polygon #5",
    type: 0,
    segments: [
      { a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
      { a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
      { a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
      { a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },
    ],
  },
  {
    name: "Polygon #6",
    type: 0,
    segments: [
      { a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
      { a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
      { a: { x: 480, y: 150 }, b: { x: 400, y: 95 } },
    ],
  },
];

const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);

  const [pos, setPos] = useState<Character>({
    x: 10,
    y: 10,
    radius: 50,
    angle: 0,
    speed: 3,
  });

  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [userAttributes, setUserAttributes] = useState({
    visibleRadius: 500,
    visibleAngle: Math.PI / 3,
    attackRadius: 300,
    attackAngle: Math.PI / 3,
  });

  useKeyPress(setKeys);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      const lightCanvas = lightRef.current;
      const buffCanvas = buffRef.current;
      const backgroundCanvas = backgroundRef.current;
      if (
        !container ||
        !renderCanvas ||
        !backgroundCanvas ||
        !lightCanvas ||
        !buffCanvas
      )
        return;
      const backgroundCtx = backgroundCanvas.getContext("2d");
      const buffCtx = buffCanvas.getContext("2d");

      if (!backgroundCtx || !buffCtx) return;

      renderCanvas.width = container.clientWidth;
      renderCanvas.height = container.clientHeight;

      const img = new Image();
      img.src = "/images/pixel_map_1.jpg";
      img.onload = () => {
        backgroundCtx.drawImage(img, 0, 0);
        backgroundCtx.strokeStyle = "#fff";
        GeometryList.forEach((seg) => {
          seg.segments.forEach((segment) => {
            backgroundCtx.beginPath();
            backgroundCtx.moveTo(segment.a.x, segment.a.y);
            backgroundCtx.lineTo(segment.b.x, segment.b.y);
            backgroundCtx.stroke();
          });
        });
        buffCtx.drawImage(backgroundCanvas, 0, 0);
      };
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
    const radian = (angle: number) => (angle * Math.PI) / 180;

    const moveCharacter = () => {
      setPos((prevPos) => {
        const { x, y, angle, speed } = prevPos;
        let moveX = 0;
        let moveY = 0;

        const rad = radian(angle);

        if (keys.up) {
          moveX -= Math.sin(rad);
          moveY -= Math.cos(rad);
        }
        if (keys.down) {
          moveX += Math.sin(rad);
          moveY += Math.cos(rad);
        }
        if (keys.left) {
          moveX -= Math.cos(rad);
          moveY += Math.sin(rad);
        }
        if (keys.right) {
          moveX += Math.cos(rad);
          moveY -= Math.sin(rad);
        }

        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
          moveX = (moveX / length) * speed;
          moveY = (moveY / length) * speed;
        }

        let newPos = {
          ...prevPos,
          x: x + moveX,
          y: y + moveY,
        };

        const {
          collided,
          x: newX,
          y: newY,
        } = handleCollision(GeometryList, 10, newPos.x, newPos.y);
        if (collided) {
          newPos.x = newX;
          newPos.y = newY;
        }

        return newPos;
      });
    };

    const intervalId = setInterval(moveCharacter, 16);
    return () => clearInterval(intervalId);
  }, [keys]);

  const render = useCallback(() => {
    const renderCanvas = renderRef.current;
    const buffCanvas = buffRef.current;
    const lightCanvas = lightRef.current;
    if (!renderCanvas || !buffCanvas || !lightCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    const lightCtx = lightCanvas.getContext("2d");
    if (!renderCtx || !lightCtx) return;

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;

    drawBuff();
    // 渲染缓冲
    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((pos.angle * Math.PI) / 180);
    renderCtx.drawImage(buffCanvas, -pos.x, -pos.y);
    renderCtx.restore();
  }, [pos]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos.angle, pos.radius, pos.x, pos.y, render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const lightCanvas = lightRef.current;
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (!lightCanvas || !buffCanvas || !backgroundCanvas) return;

    const lightCtx = lightCanvas.getContext("2d");
    const buffCtx = buffCanvas.getContext("2d");
    if (!lightCtx || !buffCtx) return;

    lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);

    // 绘制遮罩
    lightCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);

    // 绘制角色视线
    drawCharacterViewpoints(
      lightCtx,
      GeometryList,
      pos.x,
      pos.y,
      userAttributes.visibleRadius,
      userAttributes.visibleAngle,
      userAttributes.attackRadius,
      userAttributes.attackAngle,
      // -Math.PI / 2,
      -(pos.angle * Math.PI) / 180 - Math.PI / 2
    );

    // 绘制缓冲图层
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    // 绘制背景图层
    buffCtx.drawImage(backgroundCanvas, 0, 0);

    buffCtx.drawImage(lightCanvas, 0, 0);
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} />
      <canvas
        style={{ display: "none" }}
        width={width}
        height={height}
        ref={lightRef}
      />
      <canvas
        style={{ display: "none" }}
        ref={buffRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={backgroundRef}
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
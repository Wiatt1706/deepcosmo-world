"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import useScale from "../hook/canvas/useScale";
import useDraggable from "../hook/canvas/useDraggable";
import { drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { useMapStore } from "./SocketManager";
import { PixelBlock } from "@/types/MapTypes";
import algorithm from "./helpers/algorithm";
import { BottomToolView } from "./tool-layout";

// 模拟数据库
const mockDatabase: PixelBlock[] = [
  {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    color: "red",
    imgSrc:
      "https://mazrpbjakqosxybtccqi.supabase.co/storage/v1/object/public/deepcosmo_img/public/bannerImg/1180b77a-6589-4ea4-859e-47bceafc02cb.jpg",
  },
  {
    x: 60,
    y: 60,
    width: 20,
    height: 20,
    color: "blue",
  },
  {
    x: 120,
    y: 120,
    width: 20,
    height: 20,
    color: "green",
  },
  // 添加更多数据以供测试
];

// 模拟从数据库获取数据的函数
const fetchCoordinates = async (viewport: {
  x: number;
  y: number;
  width: number;
  height: number;
}): Promise<PixelBlock[]> => {
  return mockDatabase.filter(
    (coord) =>
      coord.x >= viewport.x &&
      coord.x <= viewport.x + viewport.width &&
      coord.y >= viewport.y &&
      coord.y <= viewport.y + viewport.height
  );
};

const MapCanvas = () => {
  const [toolInfo, pixelBlocks] = useMapStore((state: any) => [
    state.toolInfo,
    state.pixelBlocks,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [coordinates, setCoordinates] = useState<PixelBlock[]>([]);
  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const scale = useScale(1, 0.5, 5);
  const mapCenter = useDraggable(buffRef, { x: 0, y: 0 }, scale);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const buffCtx = buffRef?.current?.getContext("2d");

      if (!container || !buffCtx) return;

      const dpr = window.devicePixelRatio;
      buffCtx.canvas.width = Math.round(container.clientWidth * dpr);
      buffCtx.canvas.height = Math.round(container.clientHeight * dpr);

      buffCtx.canvas.style.width = `${container.clientWidth}px`;
      buffCtx.canvas.style.height = `${container.clientHeight}px`;
      buffCtx.scale(dpr, dpr);
      const initialTerrain = algorithm.TerrainRenderer({
        detail: 7,
        roughness: 5,
        pixelSize: 20,
        terrainType: "ocean",
        maxPixels: 4000,
      });
      setShowCoordinates(initialTerrain);
      console.log(initialTerrain);
    };

    initializeCanvasSize();
  }, []);

  useEvent(
    "mouseup",
    (e: MouseEvent) => {
      if (!isDragging) {
        handleMouseUp(e);
      }
      setIsDragging(false);
    },
    containerRef.current
  );

  useEvent(
    "mousedown",
    () => {
      setIsDragging(false);
    },
    containerRef.current
  );

  useEvent(
    "mousemove",
    () => {
      setIsDragging(true);
    },
    containerRef.current
  );

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;
    const buffPosition = getMouseupPixel(e, buffCanvas, scale, mapCenter);
    const coord = {
      x: Math.floor(buffPosition.x / toolInfo.pixelSize) * toolInfo.pixelSize,
      y: Math.floor(buffPosition.y / toolInfo.pixelSize) * toolInfo.pixelSize,
    };

    let width = toolInfo.pixelSize * toolInfo.brushSize;
    let height = toolInfo.pixelSize * toolInfo.brushSize;
    const pixel: PixelBlock = {
      x: coord.x,
      y: coord.y,
      width,
      height,
      color: toolInfo.editColor,
    };
    setCoordinates((prev) => [...prev, pixel]);
    // 同步到模拟数据库
    mockDatabase.push(pixel);
  };

  // 渲染
  const render = useCallback(() => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCtx.canvas.width, buffCtx.canvas.height);
    drawBuff();
  }, [scale, mapCenter, showCoordinates]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const dpr = window.devicePixelRatio;
    if (!buffCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);

    const canvasWidth = buffCtx.canvas.width / dpr;
    const canvasHeight = buffCtx.canvas.height / dpr;

    // 绘制辅助线
    drawRuler(
      buffCtx,
      mapCenter,
      scale,
      toolInfo.pixelSize,
      canvasWidth,
      canvasHeight
    );

    // 绘制像素块
    showCoordinates.forEach((coord) => {
      const scaledX = (coord.x - mapCenter.x) * scale + canvasWidth / 2;
      const scaledY = (coord.y - mapCenter.y) * scale + canvasHeight / 2;
      const scaledWidth = coord.width * scale;
      const scaledHeight = coord.height * scale;
      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      if (coord.imgSrc && imagesRef.current[coord.imgSrc]) {
        const img = imagesRef.current[coord.imgSrc];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });
  };

  // 节流函数，用于限制fetchData调用频率
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any) {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const fetchData = async () => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;

    // 计算当前视口的范围
    const viewport = {
      x: mapCenter.x - buffCtx.canvas.width / (2 * scale),
      y: mapCenter.y - buffCtx.canvas.height / (2 * scale),
      width: buffCtx.canvas.width / scale,
      height: buffCtx.canvas.height / scale,
    };

    // 根据视口范围请求数据
    const newCoordinates = await fetchCoordinates(viewport);

    // 预加载图片
    for (const coord of newCoordinates) {
      if (coord.imgSrc && !imagesRef.current[coord.imgSrc]) {
        const img = new Image();
        img.src = coord.imgSrc;
        imagesRef.current[coord.imgSrc] = img;
      }
    }

    // 更新显示的坐标数据
    setShowCoordinates(newCoordinates);
  };

  const throttledFetchData = useCallback(throttle(fetchData, 500), [
    mapCenter,
    scale,
  ]);

  useEffect(() => {
    // throttledFetchData();
  }, [mapCenter, scale]);

  useEffect(() => {
    console.log("pixelBlocks", pixelBlocks);
    setShowCoordinates((prev) => [...prev, ...pixelBlocks]);
  }, [pixelBlocks]);

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={buffRef} />
      <BottomToolView />
    </div>
  );
};

export default MapCanvas;
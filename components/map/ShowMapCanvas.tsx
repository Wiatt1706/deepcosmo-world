"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import useScale from "../hook/canvas/useScale";
import { drawRuler, getMouseupPixel } from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useEditMapStore } from "./SocketManager";

const ShowMapCanvas = ({
  initData,
  handleActClick,
  containerWidth,
  containerHeight,
}: {
  initData?: PixelBlock[];
  handleActClick?: (pixel: PixelBlock | null) => void;
  containerWidth?: number;
  containerHeight?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const [
    toolInfo,
    terrainInfo,
    setTerrainInfo,
    pixelBlocks,
    setPixelBlocks,
    setInitData,
  ] = useEditMapStore((state: any) => [
    state.toolInfo,
    state.terrainInfo,
    state.setTerrainInfo,
    state.pixelBlocks,
    state.setPixelBlocks,
    state.setInitData,
  ]);

  const [showCoordinates, setShowCoordinates] = useState<PixelBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const scale = useScale(1, 0.3, 5, containerRef.current);

  const [mapCenter, setMapCenter] = useState<Position>({ x: 0, y: 0 });
  const dragStartRef = useRef<Position | null>(null);

  useEvent("mouseup", (e: MouseEvent) => {
    if (!isDragging) {
      handleMouseUp(e);
    }
    setIsDragging(false);
    setIsDrag(false);
    dragStartRef.current = null;
  });

  useEvent(
    "mousedown",
    (e: MouseEvent) => {
      setIsDrag(true);
      setIsDragging(false);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    },
    containerRef.current
  );

  useEvent("mousemove", (e: MouseEvent) => {
    setIsDragging(true);
    if (!isDrag || !dragStartRef.current) return;

    const deltaX = (e.clientX - dragStartRef.current.x) / scale;
    const deltaY = (e.clientY - dragStartRef.current.y) / scale;

    setMapCenter((prev) => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY,
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  });

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

      if (initData) {
        setInitData(initData);
        setPixelBlocks(initData);
        setShowCoordinates(initData);
      }
    };

    initializeCanvasSize();
  }, [initData]);

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;

    // 获取鼠标点击的像素位置
    const buffPosition = getMouseupPixel(e, buffCanvas, scale, mapCenter);

    // 确定点击的像素块
    const clickedPixelBlock = showCoordinates.find(
      (block) =>
        buffPosition.x >= block.x &&
        buffPosition.x < block.x + block.width &&
        buffPosition.y >= block.y &&
        buffPosition.y < block.y + block.height
    );

    if (clickedPixelBlock) {
      // 在这里处理找到的像素块，例如高亮显示或编辑
      handleActClick?.(clickedPixelBlock);
    } else {
      handleActClick?.(null);
    }
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

    const padding = (toolInfo.pixelPadding * scale) / dpr;
    // 绘制像素块
    showCoordinates.forEach((coord) => {
      // Calculate scaled position and size with padding
      const scaledX =
        (coord.x - mapCenter.x) * scale + canvasWidth / 2 + padding;
      const scaledY =
        (coord.y - mapCenter.y) * scale + canvasHeight / 2 + padding;
      const scaledWidth = coord.width * scale - 2 * padding;
      const scaledHeight = coord.height * scale - 2 * padding;

      // Set fill style and draw rectangle
      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

      // Draw image if available
      if (coord.imgSrc && imagesRef.current[coord.imgSrc]) {
        const img = imagesRef.current[coord.imgSrc];
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }
    });
    // 绘制辅助线
    drawRuler(
      buffCtx,
      mapCenter,
      scale,
      toolInfo.pixelSize,
      canvasWidth,
      canvasHeight
    );
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

  // 模拟从数据库获取数据的函数
  const fetchCoordinates = async (viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<PixelBlock[]> => {
    return pixelBlocks.filter(
      (coord: PixelBlock) =>
        coord.x >= viewport.x &&
        coord.x <= viewport.x + viewport.width &&
        coord.y >= viewport.y &&
        coord.y <= viewport.y + viewport.height
    );
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
    pixelBlocks,
  ]);

  useEffect(() => {
    throttledFetchData();
  }, [mapCenter, scale, pixelBlocks, toolInfo]);

  return (
    <div
      className={styles["show-canvas-container"]}
      ref={containerRef}
      style={{
        width: containerWidth || "100%",
        height: containerHeight || "100%",
      }}
    >
      <canvas ref={buffRef} />
    </div>
  );
};

export default ShowMapCanvas;

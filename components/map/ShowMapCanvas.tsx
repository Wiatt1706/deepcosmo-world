"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  drawGrid,
  drawRectFrame,
  drawRuler,
  drawSignImage,
  getMouseupPixel,
  throttle,
} from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { PixelBlock, defaultSginImages } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useCanvasSize } from "../hook/canvas/useCanvasBase";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isShowSignImageAtom,
  lastListPixelBlockAtom,
  loadDataAtom,
  locatePosAtom,
  selectedPixelBlockAtom,
  signImageModuleAtom,
  viewMapCenterAtom,
  viewportAtom,
} from "./store/ShowBaseAtomStore";
const ShowMapCanvas = ({
  scale,
  loadX,
  loadY,
  pixelPadding = 1.5,
}: {
  scale: number;
  loadX?: number;
  loadY?: number;
  pixelPadding?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const signImageDrawListRef = useRef<{ [key: string]: any }>({});

  const [selectedPixelBlock, setSelectedPixelBlock] = useAtom(
    selectedPixelBlockAtom
  );
  const [lastListPixelBlock, setLastListPixelBlock] = useAtom(
    lastListPixelBlockAtom
  );

  const setViewport = useSetAtom(viewportAtom);
  const setViewMapCenter = useSetAtom(viewMapCenterAtom);
  const loadData = useAtomValue(loadDataAtom);
  const locatePos = useAtomValue(locatePosAtom);
  const isShowSignImage = useAtomValue(isShowSignImageAtom);
  const signImageModule = useAtomValue(signImageModuleAtom);

  const [mapCenter, setMapCenter] = useState<Position>({
    x: loadX || 0,
    y: loadY || 0,
  });

  const dragStartRef = useRef<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const initializeCanvasSize = useCanvasSize(containerRef, buffRef);
  useEffect(() => {
    setMapCenter({ x: locatePos.x || 0, y: locatePos.y || 0 });
  }, [locatePos]);

  useEffect(() => {
    defaultSginImages.forEach(({ id, src }) => {
      if (!imagesRef.current[id]) {
        const img = new Image();
        img.src = src;
        imagesRef.current[id] = img;
      }
    });

    loadData?.forEach((coord) => {
      if (coord.landCoverImg && !imagesRef.current[coord.landCoverImg]) {
        const img = new Image();
        img.src = coord.landCoverImg;
        imagesRef.current[coord.landCoverImg] = img;
      }
    });
  }, [loadData, defaultSginImages]);

  useEvent("mouseup", (e: MouseEvent) => {
    if (isDrag) {
      if (!isDragging) {
        handleMouseUp(e);
      }
      setIsDragging(false);
      setIsDrag(false);
      dragStartRef.current = null;
    }
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
      x: Math.round(prev.x - deltaX),
      y: Math.round(prev.y - deltaY),
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  });

  const fetchData = () => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;

    const halfWidth = buffCtx.canvas.width / (2 * scale);
    const halfHeight = buffCtx.canvas.height / (2 * scale);

    const viewport = {
      x: mapCenter.x - halfWidth,
      y: mapCenter.y - halfHeight,
      width: buffCtx.canvas.width / scale,
      height: buffCtx.canvas.height / scale,
    };

    // setViewport(viewport);
    // setViewMapCenter(mapCenter);
  };

  const throttledFetchData = useCallback(throttle(fetchData, 10000), [
    mapCenter,
    scale,
  ]);

  const render = useCallback(() => {
    const buffCtx = buffRef.current?.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCtx.canvas.width, buffCtx.canvas.height);
    drawBuff();
  }, [scale, mapCenter, selectedPixelBlock, isShowSignImage, signImageModule]);

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    const buffCanvas = buffRef.current;
    const buffCtx = buffCanvas?.getContext("2d");
    if (!buffCanvas || !buffCtx) return;

    const buffPosition = getMouseupPixel(e, buffCanvas, scale, mapCenter);

    const clickedPixelBlock = loadData?.find(
      (block) =>
        buffPosition.x >= block.x &&
        buffPosition.x < block.x + block.width &&
        buffPosition.y >= block.y &&
        buffPosition.y < block.y + block.height
    );

    setSelectedPixelBlock(clickedPixelBlock || null);

    if (clickedPixelBlock) {
      const updatedSet = new Set([clickedPixelBlock, ...lastListPixelBlock]); // 用 Set 去重

      // 将 Set 转换为数组以便进行操作
      const updatedList = Array.from(updatedSet);

      // 保留最新的 50 条数据
      if (updatedList.length > 50) {
        updatedList.splice(50); // 只保留前 50 条数据
      }
      setLastListPixelBlock(updatedList); // 再次转回 Set
    }
  };

  const getImageCenter = (
    imageKey: string,
    {
      scaledX,
      scaledY,
      scaledWidth,
      scaledHeight,
    }: {
      scaledX: number;
      scaledY: number;
      scaledWidth: number;
      scaledHeight: number;
    },
    dpr: number
  ) => {
    const { width: imgWidth, height: imgHeight } = imagesRef.current[imageKey];
    const centeredX = scaledX + scaledWidth / 2 - imgWidth / dpr / 2;
    const centeredY = scaledY + scaledHeight / 2 - imgHeight / dpr;
    return {
      img: imagesRef.current[imageKey],
      x: centeredX,
      y: centeredY,
      width: imgWidth / dpr,
      height: imgHeight / dpr,
    };
  };

  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const dpr = window.devicePixelRatio;
    if (!buffCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);

    const canvasWidth = buffCtx.canvas.width / dpr;
    const canvasHeight = buffCtx.canvas.height / dpr;

    const padding = (pixelPadding * scale) / dpr;

    const CONVER_X = (x: number, p?: number) => {
      if (!p) p = padding;
      return (x - mapCenter.x) * scale + canvasWidth / 2 + p;
    };
    const CONVER_Y = (y: number, p?: number) => {
      if (!p) p = padding;
      return (y - mapCenter.y) * scale + canvasHeight / 2 + p;
    };
    const CONVER_WIDTH = (width: number, p?: number) => {
      if (!p) p = padding;
      return width * scale - 2 * p;
    };
    const CONVER_HEIGHT = (height: number, p?: number) => {
      if (!p) p = padding;
      return height * scale - 2 * p;
    };

    // drawGrid(buffCtx, mapCenter, scale, 20, canvasWidth, canvasHeight);
    signImageDrawListRef.current = {};
    loadData?.forEach((coord) => {
      const scaledPadding = coord.borderSize
        ? padding + coord.borderSize * scale
        : padding;
      const scaledX = CONVER_X(coord.x, scaledPadding);
      const scaledY = CONVER_Y(coord.y, scaledPadding);
      const scaledWidth = CONVER_WIDTH(coord.width, scaledPadding);
      const scaledHeight = CONVER_HEIGHT(coord.height, scaledPadding);

      // Draw rectangle
      buffCtx.fillStyle = coord.color;
      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

      // Skip drawing images if the scaled width is too small
      if (scale * coord.width < 60) return;

      // Draw image if it exists
      const img = coord.landCoverImg && imagesRef.current[coord.landCoverImg];
      if (img) {
        buffCtx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
      }

      // Skip processing if images are not shown
      if (!isShowSignImage) return;

      // Helper function to handle sign drawing
      const drawSign = (signType: string) => {
        signImageDrawListRef.current[coord.id] = getImageCenter(
          signType,
          { scaledX, scaledY, scaledWidth, scaledHeight },
          dpr
        );
      };

      // Determine which sign to draw
      if (
        coord.isInland &&
        (signImageModule === "" || signImageModule === "sign_home")
      ) {
        drawSign("sign_home");
      } else if (
        coord.type === 3 &&
        (signImageModule === "" || signImageModule === "sign_play")
      ) {
        drawSign("sign_play");
      }
    });

    if (selectedPixelBlock) {
      const scaledX = CONVER_X(selectedPixelBlock.x);
      const scaledY = CONVER_Y(selectedPixelBlock.y);
      const scaledWidth = CONVER_WIDTH(selectedPixelBlock.width);
      const scaledHeight = CONVER_HEIGHT(selectedPixelBlock.height);
      drawRectFrame(buffCtx, scaledX, scaledY, scaledWidth, scaledHeight, dpr);

      signImageDrawListRef.current[selectedPixelBlock.id] = getImageCenter(
        "sign_location",
        { scaledX, scaledY, scaledWidth, scaledHeight },
        dpr
      );
    }

    Object.entries(signImageDrawListRef.current).forEach(([key, value]) => {
      buffCtx.drawImage(value.img, value.x, value.y, value.width, value.height);
    });

    // 绘制标尺
    drawRuler(buffCtx, mapCenter, scale, 20, canvasWidth, canvasHeight);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      initializeCanvasSize();
      throttledFetchData(); // Fetch data after resizing
      render(); // Render after fetching data
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial render
    initializeCanvasSize();
    throttledFetchData();
    render();

    return () => {
      resizeObserver.disconnect();
    };
  }, [initializeCanvasSize, throttledFetchData, render]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  return (
    <div
      className={styles["show-canvas-container"] + " h-full w-full"}
      ref={containerRef}
    >
      <canvas ref={buffRef} />
    </div>
  );
};

export default ShowMapCanvas;

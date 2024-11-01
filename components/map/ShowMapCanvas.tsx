"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  drawGrid,
  drawRectFrame,
  drawRuler,
  getMouseupPixel,
} from "./helpers/BaseDraw";
import { useEvent } from "../utils/GeneralEvent";
import { defaultSginImages } from "@/types/MapTypes";
import { Position } from "@/types/CanvasTypes";
import { useCanvasSize } from "../hook/canvas/useCanvasBase";
import { useAtom, useAtomValue } from "jotai";
import {
  isShowSignImageAtom,
  lastListPixelBlockAtom,
  loadDataAtom,
  locatePosAtom,
  selectedPixelBlockAtom,
  signImageModuleAtom,
} from "./store/ShowBaseAtomStore";
import { user } from "@nextui-org/theme";
const ShowMapCanvas = ({
  loadScale,
  loadX,
  loadY,
  pixelPadding = 1.5,
}: {
  loadScale: number;
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
  const loadData = useAtomValue(loadDataAtom);
  const locatePos = useAtomValue(locatePosAtom);
  const isShowSignImage = useAtomValue(isShowSignImageAtom);
  const signImageModule = useAtomValue(signImageModuleAtom);

  const [mapCenter, setMapCenter] = useState<Position>({
    x: loadX || 0,
    y: loadY || 0,
  });
  const [scale, setScale] = useState<number>(loadScale);

  const dragStartRef = useRef<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const initializeCanvasSize = useCanvasSize(containerRef, buffRef);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setScale(loadScale);
  }, [loadScale]);

  useEffect(() => {
    if (isTransitioning && selectedPixelBlock) {
      const targetCenter = {
        x: selectedPixelBlock.x + selectedPixelBlock.width / 2,
        y: selectedPixelBlock.y + selectedPixelBlock.height / 2,
      };

      const duration = 3000; // 动画时长
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 计算当前的缩放和中心
        const currentScale =
          scale +
          (Math.max(window.innerWidth, window.innerHeight) /
            Math.max(selectedPixelBlock.width, selectedPixelBlock.height) -
            scale) *
            progress;
        const currentX =
          mapCenter.x + (targetCenter.x - mapCenter.x) * progress;
        const currentY =
          mapCenter.y + (targetCenter.y - mapCenter.y) * progress;

        setScale(currentScale);
        setMapCenter({ x: currentX, y: currentY });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isTransitioning, selectedPixelBlock]);

  // useEffect(() => {
  //   if (isTransitioning && selectedPixelBlock) {
  //     setIsTransitioning(true);
  //     const targetCenter = {
  //       x: selectedPixelBlock.x + selectedPixelBlock.width / 2,
  //       y: selectedPixelBlock.y + selectedPixelBlock.height / 2,
  //     };
  //     const duration = 3000; // 动画时长
  //     const startTime = performance.now();

  //     const animate = (currentTime: number) => {
  //       const elapsed = currentTime - startTime;
  //       const progress = Math.min(elapsed / duration, 1);

  //       // 计算当前的缩放和中心
  //       const currentScale = scale + (4 - scale) * progress; // 从当前缩放到目标缩放
  //       const currentX =
  //         mapCenter.x + (targetCenter.x - mapCenter.x) * progress;
  //       const currentY =
  //         mapCenter.y + (targetCenter.y - mapCenter.y) * progress;

  //       setScale(currentScale);
  //       setMapCenter({ x: currentX, y: currentY });

  //       if (progress < 1) {
  //         requestAnimationFrame(animate);
  //       } else {
  //         // 动画结束后的重置
  //         setIsTransitioning(false);
  //       }
  //     };

  //     requestAnimationFrame(animate);
  //   }
  // }, [isTransitioning, selectedPixelBlock]);

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

  useEvent(
    "mousemove",
    useCallback(
      (e: MouseEvent) => {
        setIsDragging(true);
        if (!isDrag || !dragStartRef.current) return;

        const deltaX = (e.clientX - dragStartRef.current.x) / scale;
        const deltaY = (e.clientY - dragStartRef.current.y) / scale;

        setMapCenter((prev) => ({
          x: prev.x - deltaX,
          y: prev.y - deltaY,
        }));

        dragStartRef.current = { x: e.clientX, y: e.clientY };
      },
      [scale, dragStartRef, isDrag, setMapCenter]
    )
  );

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
      setIsTransitioning(true);

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

    drawGrid(buffCtx, mapCenter, scale, 20, canvasWidth, canvasHeight);
    signImageDrawListRef.current = {};
    loadData?.forEach((coord) => {
      const scaledPadding = coord.borderSize
        ? padding + coord.borderSize * scale
        : padding;
      const scaledX = CONVER_X(coord.x, scaledPadding);
      const scaledY = CONVER_Y(coord.y, scaledPadding);
      const scaledWidth = CONVER_WIDTH(coord.width, scaledPadding);
      const scaledHeight = CONVER_HEIGHT(coord.height, scaledPadding);

      if (scale * coord.width < 60) {
        buffCtx.fillStyle = "rgba(0,0,0,0.1)";
        buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
        return;
      } else {
        buffCtx.fillStyle = coord.color;
        buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      }

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
        coord.type === 1 &&
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
      render(); // Render after fetching data
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    // Initial render
    initializeCanvasSize();
    render();

    return () => {
      resizeObserver.disconnect();
    };
  }, [initializeCanvasSize, render]);

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

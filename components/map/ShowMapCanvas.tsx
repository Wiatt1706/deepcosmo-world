"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import {
  drawGrid,
  drawGridDynamic,
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
const ShowMapCanvas = ({
  scale,
  setScale,
  loadX,
  loadY,
  pixelPadding = 1.5,
}: {
  scale: number;
  setScale: (scale: number) => void;
  loadX?: number;
  loadY?: number;
  pixelPadding?: number;
}) => {
  // 用于存储动画开始时间
  const animationStartRef = useRef<number | null>(null);
  // 用于判断是否初次渲染的状态
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const signImageDrawListRef = useRef<{ [key: string]: any }>({});
  // 创建一个存储每个方块随机延迟的 Map
  const blockDelays = useRef(new Map());
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

  const render = useCallback(
    (timestamp?: number) => {
      const buffCtx = buffRef.current?.getContext("2d");
      if (!buffCtx) return;

      if (isFirstLoad && timestamp) {
        // 如果是初次加载，计算动画进度
        if (animationStartRef.current === null)
          animationStartRef.current = timestamp || 0;
        const progress = (timestamp - animationStartRef.current) / 1500; // 动画持续时间增加到1.5秒
        drawAnimatedBuff(easeInOutQuad(progress));
        if (progress < 1) {
          requestAnimationFrame(render);
        } else {
          setIsFirstLoad(false);
          animationStartRef.current = null;
        }
      } else if (!isFirstLoad) {
        drawBuff();
      }
    },
    [
      isFirstLoad,
      scale,
      mapCenter,
      selectedPixelBlock,
      isShowSignImage,
      signImageModule,
    ]
  );

  // 缓动函数，用于平滑缩放
  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const drawAnimatedBuff = (progress: number) => {
    console.log("drawAnimatedBuff", progress);

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
    loadData?.forEach((coord) => {
      // 获取或生成该方块的随机延迟
      if (!blockDelays.current.has(coord.id)) {
        const delay = Math.random() * 0.5; // 每个方块的随机延迟 0~0.5秒
        blockDelays.current.set(coord.id, delay);
      }
      const delay = blockDelays.current.get(coord.id);

      // 计算方块的显示进度，考虑每个方块的延迟
      const blockProgress = Math.min(
        Math.max((easeInOutQuad(progress) - delay) / 0.5, 0),
        1
      ); // 0~1 范围的进度

      // 透明度渐变
      const opacity = blockProgress;
      buffCtx.fillStyle = `rgba(${parseInt(
        (coord.color as string).slice(1, 3),
        16
      )}, ${parseInt((coord.color as string).slice(3, 5), 16)}, ${parseInt(
        (coord.color as string).slice(5, 7),
        16
      )}, ${opacity})`;

      const scaledPadding = coord.borderSize
        ? padding + coord.borderSize * scale
        : padding;
      const scaledX = CONVER_X(coord.x, scaledPadding);
      const scaledY = CONVER_Y(coord.y, scaledPadding);
      const scaledWidth = CONVER_WIDTH(coord.width, scaledPadding);
      const scaledHeight = CONVER_HEIGHT(coord.height, scaledPadding);

      buffCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    });
  };

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

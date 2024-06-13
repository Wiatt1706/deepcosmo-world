"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, CanvasInfo, Geometry } from "@/types/CanvasTypes";
import { useCanvasEditorStore, useStatusStore } from "./SocketManager";
import EditorMenuLeft from "@/components/canvas/editor/layout/menu-left-layout/menu-left";
import { useEvent } from "@/components/utils/GeneralEvent";

const EditorCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);

  const [geometryList, setGeometryList, projectInfo, setProjectInfo] =
    useCanvasEditorStore((state) => [
      state.geometryList,
      state.setGeometryList,
      state.projectInfo,
      state.setProjectInfo,
    ]);
  const {
    isSpacePressed,
    isMousePressed,
    setIsSpacePressed,
    setIsMousePressed,
  } = useStatusStore();

  const [canvasInfo, setCanvasInfo] = useState<CanvasInfo>({
    offsetX: 0,
    offsetY: 0,
    offseAngle: 0,
  });

  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      setIsSpacePressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      setIsSpacePressed(false);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (isSpacePressed) {
      setIsMousePressed(true);
      setStartMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isSpacePressed && isMousePressed) {
      const deltaX = startMousePos.x - e.clientX;
      const deltaY = startMousePos.y - e.clientY;
      setCanvasInfo((prev) => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
      }));
      setStartMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSpacePressed, isMousePressed, startMousePos]);

  useEvent("resize", (e: UIEvent) => {
    initializeCanvasSize();
  });
  useEffect(() => {
    initializeCanvasSize();
  }, []);

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
    buffCanvas.width = projectInfo.width;
    buffCanvas.height = projectInfo.height;

    render();
  };
  const render = useCallback(() => {
    const renderCanvas = renderRef.current;
    const buffCanvas = buffRef.current;
    const lightCanvas = lightRef.current;
    if (!renderCanvas || !buffCanvas || !lightCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    const lightCtx = lightCanvas.getContext("2d");
    if (!renderCtx || !lightCtx) return;

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
    buffCanvas.width = projectInfo.width;
    buffCanvas.height = projectInfo.height;
    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height / 2;

    drawBuff();
    // 渲染缓冲
    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((canvasInfo.offseAngle * Math.PI) / 180);
    renderCtx.drawImage(
      buffCanvas,
      -canvasInfo.offsetX - buffCanvas.width / 2,
      -canvasInfo.offsetY - buffCanvas.height / 2
    );
    renderCtx.restore();
  }, [canvasInfo, projectInfo]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (!buffCanvas || !backgroundCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;

    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    // 绘制遮罩
    buffCtx.fillStyle = projectInfo?.canvasBackgroundColor;
    buffCtx.fillRect(0, 0, buffCanvas.width, buffCanvas.height);

    // 绘制背景图层
    buffCtx.drawImage(backgroundCanvas, 0, 0);
  };

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasInfo, render, projectInfo]);

  return (
    <div
      className={styles["canvas-container"]}
      style={{ background: projectInfo?.backgroundColor }}
      ref={containerRef}
    >
      <canvas ref={renderRef} />
      <canvas style={{ display: "none" }} ref={lightRef} />
      <canvas style={{ display: "none" }} ref={buffRef} />
      <canvas style={{ display: "none" }} ref={backgroundRef} />

      <div className={styles["bottom-container"]}>
        <span></span>
        <span className="pr-[50px]">
          {"offset：（" + canvasInfo.offsetX + "," + canvasInfo.offsetY + "）"}
        </span>
      </div>
    </div>
  );
};

export default EditorCanvas;

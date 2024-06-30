"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/map-canvas.module.css";
import { BoardProps, Position } from "@/types/CanvasTypes";
import useScale from "../hook/canvas/useScale";
import useDraggable from "../hook/canvas/useDraggable";

const MapCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);

  const scale = useScale(1.5, 0.5, 30);
  const mapCenter = useDraggable(renderRef, { x: 10, y: 10 }, scale);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      const buffCanvas = buffRef.current;
      if (!container || !renderCanvas || !buffCanvas) return;
      const buffCtx = buffCanvas.getContext("2d");

      if (!buffCtx) return;

      renderCanvas.width = container.clientWidth;
      renderCanvas.height = container.clientHeight;
    };

    initializeCanvasSize();
  }, []);

  // 渲染
  const render = useCallback(() => {
    const renderCtx = renderRef.current?.getContext("2d");
    const buffCtx = buffRef.current?.getContext("2d");
    if (!renderCtx || !buffCtx) return;
    const centerX = renderCtx.canvas.width / 2;
    const centerY = renderCtx.canvas.height / 2;

    renderCtx.clearRect(0, 0, renderCtx.canvas.width, renderCtx.canvas.height);
    drawBuff();
    // 渲染缓冲
    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.scale(scale, scale); // 放大两倍
    renderCtx.drawImage(buffCtx.canvas, -mapCenter.x, -mapCenter.y);
    renderCtx.restore();
  }, [scale, mapCenter, buffRef, renderRef]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;

    if (!buffCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    // 绘制缓冲图层
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    buildGrids(buffCanvas, 20, 10, "#fff", "#d9d9d9");
  };

  const buildGrids = (
    cvs: HTMLCanvasElement,
    gridPixelSize: number,
    gridGap: number,
    gridColor: string,
    fillColor: string
  ): void => {
    const bufferCtx = cvs.getContext("2d") as CanvasRenderingContext2D;
    const width = cvs.width;
    const height = cvs.height;

    console.log("width", width, height);

    bufferCtx.fillStyle = fillColor;
    bufferCtx.fillRect(0, 0, width, height);
    bufferCtx.strokeStyle = gridColor;

    for (let i = 0; i <= width; i += gridPixelSize) {
      bufferCtx.beginPath();
      bufferCtx.moveTo(Math.floor(i), Math.floor(0));
      bufferCtx.lineTo(Math.floor(i), Math.floor(height));
      bufferCtx.lineWidth = 0 === i % gridGap ? 2 : 3;
      bufferCtx.closePath();
      bufferCtx.stroke();
    }

    for (let j = 0; j <= height; j += gridPixelSize) {
      bufferCtx.beginPath();
      bufferCtx.moveTo(Math.floor(0), Math.floor(j));
      bufferCtx.lineTo(Math.floor(width), Math.floor(j));
      bufferCtx.lineWidth = 0 === j % gridGap ? 2 : 3;
      bufferCtx.closePath();
      bufferCtx.stroke();
    }
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} />
      <canvas
        style={{ display: "none" }}
        ref={buffRef}
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default MapCanvas;

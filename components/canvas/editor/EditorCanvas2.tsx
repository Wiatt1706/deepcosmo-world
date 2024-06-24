"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import {
  BoardProps,
  CanvasInfo,
  Geometry,
  Point,
  Segment,
} from "@/types/CanvasTypes";
import { useCanvasEditorStore, useStatusStore } from "./SocketManager";
import EditorMenuLeft from "@/components/canvas/editor/layout/menu-left-layout/menu-left";
import { useEvent } from "@/components/utils/GeneralEvent";
import { useBaseKeyPress } from "@/components/hook/useKeyPress";
import {
  calculateRectangleVertices,
  generateRectangleAndMerge,
} from "../helpers/BaseDraw";
import { render } from "react-dom";

const EditorCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const strongRef = useRef<HTMLCanvasElement | null>(null);

  const [
    geometryList,
    setGeometryList,
    projectInfo,
    setProjectInfo,
    lastWellPoint,
    setLastWellPoint,
  ] = useCanvasEditorStore((state) => [
    state.geometryList,
    state.setGeometryList,
    state.projectInfo,
    state.setProjectInfo,
    state.lastWellPoint,
    state.setLastWellPoint,
  ]);
  const {
    operatingModes,
    setOperatingModes,
    isMousePressed,
    setIsMousePressed,
    wallThickness,
  } = useStatusStore();

  const [keys, setKeys] = useState({
    space: false,
    e: false,
    v: false,
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [canvasInfo, setCanvasInfo] = useState<CanvasInfo>({
    offsetX: 0,
    offsetY: 0,
    offseAngle: 0,
  });

  useEffect(() => {
    if (keys.e) {
      console.log("geometryList：", geometryList);

      setOperatingModes(operatingModes ^ 1);
      // 初始化墙体编辑数据
      setLastWellPoint(null);
      setLastStrongPos(null);
    }
    if (keys.v) setOperatingModes(0);
  }, [keys]);

  const [startMousePos, setStartMousePos] = useState<Point>({ x: 0, y: 0 });
  const [lastStrongPos, setLastStrongPos] = useState<Point | null>(null);
  useBaseKeyPress(setKeys);

  const getStrongClientRect = (clientX: number, clientY: number): Point => {
    const strongCanvas = strongRef.current;
    const buffCanvas = buffRef.current;
    const renderCanvas = renderRef.current;
    if (!strongCanvas || !renderCanvas || !buffCanvas) return { x: 0, y: 0 };
    const strongCtx = strongCanvas.getContext("2d");
    const renderCtx = renderCanvas.getContext("2d");

    if (!strongCtx || !renderCtx) return { x: 0, y: 0 };

    const rect = renderCanvas.getBoundingClientRect();
    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height / 2;
    const dx = clientX - rect.left;
    const dy = clientY - rect.top;
    const x = dx - (centerX - buffCanvas.width / 2) + canvasInfo.offsetX;
    const y = dy - (centerY - buffCanvas.height / 2) + canvasInfo.offsetY;
    return { x, y };
  };

  const wallOnclickHandler = (clientX: number, clientY: number) => {
    const strongCanvas = strongRef.current;
    if (!strongCanvas) return null;
    const strongCtx = strongCanvas.getContext("2d");
    if (!strongCtx) return null;
    const { x, y } = getStrongClientRect(clientX, clientY);
    // 计算矩形左上角的坐标并绘制矩形
    const halfThickness = wallThickness / 2;
    strongCtx.fillStyle = "red";
    strongCtx.fillRect(
      x - halfThickness,
      y - halfThickness,
      wallThickness,
      wallThickness
    );

    // 计算矩形的四个顶点坐标
    const topLeft = { x: x - halfThickness, y: y - halfThickness };
    const topRight = { x: x + halfThickness, y: y - halfThickness };
    const bottomRight = { x: x + halfThickness, y: y + halfThickness };
    const bottomLeft = { x: x - halfThickness, y: y + halfThickness };
    // 更新最后一个点
    setLastWellPoint({ x, y });

    // 仅第一次新增几何
    if (!lastWellPoint) {
      // 加入几何体清单
      setGeometryList([
        ...geometryList,
        {
          name: `Polygon #${geometryList.length + 1}`,
          type: 0,
          segments: [
            { a: topLeft, b: topRight },
            { a: topRight, b: bottomRight },
            { a: bottomRight, b: bottomLeft },
            { a: bottomLeft, b: topLeft },
          ],
        },
      ]);
    } else {
      const newGeometryList = [...geometryList];
      // 获取最后一个对象
      const lastGeometry = newGeometryList[newGeometryList.length - 1];
      let segments = lastGeometry.segments;

      const wallPoint = calculateRectangleVertices(
        x,
        y,
        lastWellPoint.x,
        lastWellPoint.y,
        wallThickness
      );
      segments.push(...wallPoint);
      // 更新最后一个对象的 segments 属性
      geometryList[geometryList.length - 1] = {
        ...lastGeometry,
        segments,
      };
      // 使用 setGeometryList 更新状态
      setGeometryList(newGeometryList);
    }
  };
  const handleMouseDown = (e: MouseEvent) => {
    setIsMousePressed(true);
    setStartMousePos({ x: e.clientX, y: e.clientY });
    // 墙体编辑模式打开-点击
    if (operatingModes === 1) {
      wallOnclickHandler(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (keys.space && isMousePressed) {
      const deltaX = startMousePos.x - e.clientX;
      const deltaY = startMousePos.y - e.clientY;
      setCanvasInfo((prev) => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
      }));
      setStartMousePos({ x: e.clientX, y: e.clientY });
    }

    if (operatingModes === 1 && lastWellPoint) {
      console.log("wall editor");
      setLastStrongPos(getStrongClientRect(e.clientX, e.clientY));
      //墙体编辑模式打开-拖拽
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    // 墙体编辑模式打开-释放
    if (operatingModes === 1) {
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMousePressed, startMousePos, operatingModes, geometryList]);

  useEvent("resize", (e: UIEvent) => {
    initializeCanvasSize();
  });
  useEffect(() => {
    initializeCanvasSize();
  }, []);

  const initializeCanvasSize = () => {
    const container = containerRef.current;
    const renderCanvas = renderRef.current;
    const strongCanvas = strongRef.current;
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (
      !container ||
      !renderCanvas ||
      !backgroundCanvas ||
      !strongCanvas ||
      !buffCanvas
    )
      return;
    const backgroundCtx = backgroundCanvas.getContext("2d");
    const buffCtx = buffCanvas.getContext("2d");

    if (!backgroundCtx || !buffCtx) return;

    renderCanvas.width = container.clientWidth;
    renderCanvas.height = container.clientHeight;

    const img = new Image();
    img.src = "/images/map01.png";
    img.onload = () => {
      setProjectInfo("width", img.width);
      setProjectInfo("height", img.height);
      backgroundCanvas.width = img.width;
      backgroundCanvas.height = img.height;
      backgroundCtx.drawImage(img, 0, 0);
      backgroundCtx.strokeStyle = "#fff";
      draw;
    };
  };

  const draw = () => {
    const renderCanvas = renderRef.current;
    const buffCanvas = buffRef.current;
    const strongCanvas = strongRef.current;
    if (!renderCanvas || !buffCanvas || !strongCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    const strongCtx = strongCanvas.getContext("2d");
    if (!renderCtx || !strongCtx) return;

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height / 2;

    drawBuff();
    // 渲染缓冲
    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((canvasInfo.offseAngle * Math.PI) / 180);
    renderCtx.drawImage(
      buffCanvas,
      -buffCanvas.width / 2 - canvasInfo.offsetX,
      -buffCanvas.height / 2 - canvasInfo.offsetY
    );
    renderCtx.restore();

    console.log("projectInfo", projectInfo);
  };

  useEffect(() => {
    draw();
  }, [
    draw,
    canvasInfo,
    projectInfo,
    operatingModes,
    geometryList,
    lastStrongPos,
  ]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    const strongCanvas = strongRef.current;
    if (!buffCanvas || !backgroundCanvas || !strongCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    const backgroundCtx = backgroundCanvas.getContext("2d");
    if (!buffCtx || !backgroundCtx) return;
    buffCanvas.width = projectInfo.width;
    buffCanvas.height = projectInfo.height;
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    // 绘制遮罩
    buffCtx.fillStyle = projectInfo?.canvasBackgroundColor;
    buffCtx.fillRect(0, 0, buffCanvas.width, buffCanvas.height);

    // 绘制背景图层
    buffCtx.drawImage(backgroundCanvas, 0, 0);
    // 绘制坚固图层
    drawGeometry();
    buffCtx.drawImage(strongCanvas, 0, 0);
  };

  const drawGeometry = () => {
    const buffCanvas = buffRef.current;
    const strongCanvas = strongRef.current;
    if (!buffCanvas || !strongCanvas) return;
    const strongCtx = strongCanvas.getContext("2d");
    if (!strongCtx) return;
    strongCanvas.width = projectInfo.width;
    strongCanvas.height = projectInfo.height;
    strongCtx.clearRect(0, 0, strongCanvas.width, strongCanvas.height);
    strongCtx.strokeStyle = "#fff";
    geometryList.forEach((seg: Geometry) => {
      seg.segments.forEach((segment: Segment) => {
        strongCtx.beginPath();
        strongCtx.moveTo(segment.a.x, segment.a.y);
        strongCtx.lineTo(segment.b.x, segment.b.y);
        strongCtx.stroke();
      });
    });

    if (lastStrongPos) {
      // strongCtx.beginPath();
      // strongCtx.moveTo(segment.a.x, segment.a.y);
      // strongCtx.lineTo(segment.b.x, segment.b.y);
      // strongCtx.stroke();
      const lastGeometry = geometryList[geometryList.length - 1];
      let segments = lastGeometry.segments;
      const wallPoint = calculateRectangleVertices(
        lastStrongPos.x,
        lastStrongPos.y,
        lastWellPoint.x,
        lastWellPoint.y,
        wallThickness
      );

      strongCtx.strokeStyle = "red";
      strongCtx.beginPath();
      strongCtx.moveTo(
        segments[segments.length - 4].a.x,
        segments[segments.length - 4].a.y
      );
      strongCtx.lineTo(
        segments[segments.length - 4].b.x,
        segments[segments.length - 4].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "yellow";
      strongCtx.beginPath();
      strongCtx.moveTo(
        segments[segments.length - 3].a.x,
        segments[segments.length - 3].a.y
      );
      strongCtx.lineTo(
        segments[segments.length - 3].b.x,
        segments[segments.length - 3].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "blue";
      strongCtx.beginPath();
      strongCtx.moveTo(
        segments[segments.length - 2].a.x,
        segments[segments.length - 2].a.y
      );
      strongCtx.lineTo(
        segments[segments.length - 2].b.x,
        segments[segments.length - 2].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "green";
      strongCtx.beginPath();
      strongCtx.moveTo(
        segments[segments.length - 1].a.x,
        segments[segments.length - 1].a.y
      );
      strongCtx.lineTo(
        segments[segments.length - 1].b.x,
        segments[segments.length - 1].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "#fff";
      wallPoint.forEach((segment: Segment) => {
        strongCtx.beginPath();
        strongCtx.moveTo(segment.a.x, segment.a.y);
        strongCtx.lineTo(segment.b.x, segment.b.y);
        strongCtx.stroke();
      });

      strongCtx.strokeStyle = "red";
      strongCtx.beginPath();
      strongCtx.moveTo(
        wallPoint[wallPoint.length - 4].a.x,
        wallPoint[wallPoint.length - 4].a.y
      );
      strongCtx.lineTo(
        wallPoint[wallPoint.length - 4].b.x,
        wallPoint[wallPoint.length - 4].b.y
      );
      wallPoint;
      strongCtx.stroke();

      strongCtx.strokeStyle = "yellow";
      strongCtx.beginPath();
      strongCtx.moveTo(
        wallPoint[wallPoint.length - 3].a.x,
        wallPoint[wallPoint.length - 3].a.y
      );
      strongCtx.lineTo(
        wallPoint[wallPoint.length - 3].b.x,
        wallPoint[wallPoint.length - 3].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "blue";
      strongCtx.beginPath();
      strongCtx.moveTo(
        wallPoint[wallPoint.length - 2].a.x,
        wallPoint[wallPoint.length - 2].a.y
      );
      strongCtx.lineTo(
        wallPoint[wallPoint.length - 2].b.x,
        wallPoint[wallPoint.length - 2].b.y
      );
      strongCtx.stroke();

      strongCtx.strokeStyle = "green";
      strongCtx.beginPath();
      strongCtx.moveTo(
        wallPoint[wallPoint.length - 1].a.x,
        wallPoint[wallPoint.length - 1].a.y
      );
      strongCtx.lineTo(
        wallPoint[wallPoint.length - 1].b.x,
        wallPoint[wallPoint.length - 1].b.y
      );
      strongCtx.stroke();

      //  const newSegments = generateRectangleAndMerge(
      //    segments,
      //    lastStrongPos.x,
      //    lastStrongPos.y,
      //    wallThickness
      //  );
    }
  };

  return (
    <div
      className={styles["canvas-container"]}
      style={{ background: projectInfo?.backgroundColor }}
      ref={containerRef}
    >
      <canvas ref={renderRef} />
      <canvas style={{ display: "none" }} ref={strongRef} />
      <canvas style={{ display: "none" }} ref={buffRef} />
      <canvas style={{ display: "none" }} ref={backgroundRef} />

      <div className={styles["bottom-container"]}>
        <span></span>
        <div className="pr-[50px]">
          <span className="pr-2">operatingMode：{operatingModes}</span>
          <span>
            {"offset：（" +
              canvasInfo.offsetX +
              "," +
              canvasInfo.offsetY +
              "）"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;

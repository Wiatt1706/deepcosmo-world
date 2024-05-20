import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useStores } from "./stores/stores";
import styles from "./CanvasModule.module.css";
import { useEvent, useKeyboardEvent } from "@/components/utils/GeneralEvent";
import { CanvasModuleProps, CssSize } from "./interface/CanvasTypes";
import _ from "@/components/utils/helpers";

const CanvasBoard: React.FC<CanvasModuleProps> = observer((props) => {
  const { canvasStore } = useStores();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // 主画布引用
  const maskRef = useRef<HTMLCanvasElement | null>(null); // 遮罩画布引用
  
  const bufferRef = useRef<HTMLCanvasElement | null>(null); // 缓冲画布引用

  let isDragging: boolean = false; // 是否被拖拽
  let lastCoord: { left: number; top: number };

  // // 添加一个 useEffect 监听 scroll 的变化
  // useEffect(() => {
  //   draw(); // 当 scroll 变化时触发绘制
  //   if (props.onRealTimeImg) {
  //     props.onRealTimeImg(clipImage());
  //   }
  // }, [canvasStore.scroll, canvasStore.scale]);

  useEffect(() => {
    initializeCanvasSize();
  }, []);

  useEvent(
    "mousedown",
    (e: MouseEvent) => {
      handleDragStart(e);
    },
    canvasRef.current
  );

  useEvent(
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();
      let wheelDelta: number = e.deltaY;
      handleWheel(wheelDelta < 0);
    },
    canvasRef.current
  );

  useEvent("resize", (e: UIEvent) => {
    resize();
  });

  const resize = () => {
    const dpr = window.devicePixelRatio;
    // 获取容器的尺寸
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const buffer = bufferRef.current;

    if (!container || !canvas || !buffer) {
      return;
    }
    const bufferCtx = buffer.getContext("2d");
    if (!bufferCtx) {
      return;
    }
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const ocWidth = props.imageFile.width;
    const ocHeight = props.imageFile.height;
    canvasStore.setCssSize({ width: ocWidth, height: ocHeight });
    // 清晰度调整
    _.adaptDPR({
      canvas,
      dpr,
      cssWidth: containerWidth,
      cssHeight: containerHeight,
    });

    _.adaptDPR({ canvas: buffer, dpr, cssWidth: ocWidth, cssHeight: ocHeight });

    canvasStore.setScale(1);
    bufferCtx.drawImage(props.imageFile, 0, 0);
    // 设定当前缓冲最大定位
    canvasStore.setScrollMax({
      x: ocWidth * dpr,
      y: ocHeight * dpr,
    });

    // 定位 默认居中
    canvasStore.setScroll({
      x: Math.floor((containerWidth - buffer.width / dpr) / 2),
      y: Math.floor((containerHeight - buffer.height / dpr) / 2),
    });

    // 设定中心鼠标坐标
    canvasStore.setCenterPosition({
      x: canvas.width / 2 / dpr,
      y: canvas.height / 2 / dpr,
    });

    initMask(canvas, props.showSize);
  };

  const initMask = (canvas: HTMLCanvasElement, showSize?: CssSize) => {
    const dpr = window.devicePixelRatio;
    const mask = maskRef.current;

    if (!mask) {
      return;
    }
    const { width = canvas.width, height = canvas.height } = showSize || {};
    const canvasCtx = canvas.getContext("2d");
    const maskCtx = mask.getContext("2d");
    if (!canvasCtx || !maskCtx) {
      return;
    }
    const cwidth = canvas.width / dpr;
    const cheight = canvas.height / dpr;

    var x = (cwidth - width) / 2;
    var y = (cheight - height) / 2;
    mask.width = canvas.width;
    mask.height = canvas.height;
    maskCtx.fillStyle = "rgba(12, 32, 50, 0.9)";
    maskCtx.fillRect(0, 0, cwidth, cheight);
    maskCtx.globalCompositeOperation = "destination-out";
    maskCtx.fillStyle = "#fff";
    maskCtx.fillRect(x, y, width, height);
  };

  // 初始化窗口大小
  const initializeCanvasSize = (): void => {
    resize();
  };

  const handleDragStart = (e: MouseEvent) => {
    canvasStore.setPositionDown(_.getPosition(e));
    isDragging = true;
    lastCoord = { left: e.clientX, top: e.clientY };

    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragging = (e: MouseEvent) => {
    const newLeft = e.clientX - lastCoord.left;
    const newTop = e.clientY - lastCoord.top;

    canvasStore.moveCanvas(
      canvasRef.current,
      bufferRef.current,
      newLeft,
      newTop
    );

    lastCoord = { left: e.clientX, top: e.clientY };
  };

  const handleDragEnd = () => {
    isDragging = false;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  const handleWheel = (isUp: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || canvasStore.isAnimating) {
      // 如果正在执行动画，不处理新的滚轮事件
      return;
    }
    // 计算中心点坐标
    const dpr = window.devicePixelRatio;
    const centerX = canvas.width / 2 / dpr;
    const centerY = canvas.height / 2 / dpr;

    let scale = canvasStore.scale;

    const n: number = 1.25;
    const n2: number = 1 / n;
    const newScale: number = !isUp ? (scale || 1) * n2 : (scale || 1) * n;

    canvasStore.setDeltaX(((1 - newScale) / newScale) * centerX);
    canvasStore.setDeltaY(((1 - newScale) / newScale) * centerY);

    // 设置缩放动画
    canvasStore.setScale(newScale);
  };

  // 绘制主画板
  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const buffer = bufferRef.current;
    const mask = maskRef.current;

    if (!canvas || !buffer || !mask) {
      return;
    }
    const canvasCtx = canvas.getContext("2d");
    const maskCtx = mask.getContext("2d");
    if (!canvasCtx || !maskCtx) {
      return;
    }
    const cwidth = canvas.width / dpr;
    const cheight = canvas.height / dpr;

    canvasCtx.clearRect(0, 0, cwidth, cheight);
    // 保存当前变换状态
    canvasCtx.save();

    // 计算中心点坐标
    const centerX = cwidth / 2;
    const centerY = cheight / 2;
    // 平移画板，将中心点移到坐标原点
    canvasCtx.translate(centerX, centerY);
    // 处理缩放
    canvasCtx.scale(canvasStore.scale, canvasStore.scale);
    // 再次平移，将画板还原到原来位置
    canvasCtx.translate(-centerX, -centerY);

    drawImage(canvasCtx, buffer);

    canvasCtx.restore();
    canvasCtx.drawImage(
      mask, //规定要使用的图像、画布或视频。
      0,
      0, //开始剪切的 x 坐标位置。
      mask.width,
      mask.height //被剪切图像的高度。
    );
  };

  const drawImage = (
    canvasCtx: CanvasRenderingContext2D,
    buffer: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio;
    const scroll = canvasStore.scroll;
    canvasCtx.drawImage(
      buffer, //规定要使用的图像、画布或视频。
      0,
      0, //开始剪切的 x 坐标位置。
      buffer.width * dpr,
      buffer.height * dpr, //被剪切图像的高度。
      scroll.x,
      scroll.y, //在画布上放置图像的 x 、y坐标位置。
      buffer.width,
      buffer.height //要使用的图像的宽度、高度
    );
  };

  const clipImage = () => {
    const dpr = window.devicePixelRatio;

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const canvasWidth = canvas.width; // 画板宽度
    const canvasHeight = canvas.height; // 画板高度

    // 计算正中间区域的起始坐标
    const centerX = canvasWidth / 2 - 0; // 中心X坐标减去一半的宽度
    const centerY = canvasHeight / 2 - 60 * dpr; // 中心Y坐标减去一半的高度

    const width = 120 * dpr; // 指定宽度
    const height = 120 * dpr; // 指定高度

    // 获取指定区域的像素数据
    const imageData = context.getImageData(
      centerX / dpr,
      centerY,
      width,
      height
    );

    // 创建一个新Canvas，用于存放指定区域的内容
    const newCanvas = document.createElement("canvas");
    newCanvas.width = width;
    newCanvas.height = height;
    const newContext = newCanvas.getContext("2d");

    if (!newContext) {
      return;
    }
    // 将指定区域的像素数据放入新Canvas
    newContext.putImageData(imageData, 0, 0);

    // 获取包含指定区域内容的Data URL
    return newCanvas.toDataURL();
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={canvasRef} />
      <canvas style={{ display: "none" }} ref={bufferRef} />
      <canvas style={{ display: "none" }} ref={maskRef} />
    </div>
  );
});

export default CanvasBoard;

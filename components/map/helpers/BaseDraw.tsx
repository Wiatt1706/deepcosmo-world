import { Position } from "@/types/CanvasTypes";
import { PixelBlock } from "@/types/MapTypes";

export const buildGrids = (
  cvs: HTMLCanvasElement,
  gridPixelSize: number,
  gridGap: number,
  gridColor: string,
  fillColor: string
): void => {
  const bufferCtx = cvs.getContext("2d") as CanvasRenderingContext2D;
  const width = cvs.width;
  const height = cvs.height;

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

export const drawPixel = (
  ctx: CanvasRenderingContext2D,
  pixel: PixelBlock,
  borderSize: number
) => {
  const x = pixel.x + borderSize; //坐标偏移一个边框大小
  const y = pixel.y + borderSize; //坐标偏移一个边框大小
  ctx.fillStyle = pixel.color;
  ctx.fillRect(
    x,
    y,
    pixel.width - borderSize * 2,
    pixel.height - borderSize * 2
  );
};

export const getMouseupPixel = (
  e: MouseEvent,
  renderCanvas: HTMLCanvasElement,
  scale: number,
  mapCenter: Position
): Position => {
  const renderRect = renderCanvas.getBoundingClientRect();

  // Get mouse position relative to renderCanvas
  const mouseX = e.clientX - renderRect.left;
  const mouseY = e.clientY - renderRect.top;

  // Convert to canvas coordinates considering the device pixel ratio
  const dpr = window.devicePixelRatio;

  // Convert to unscaled coordinates
  const unscaledX = mouseX / scale;
  const unscaledY = mouseY / scale;

  // Apply reverse translation
  const buffX =
    unscaledX + mapCenter.x - renderCanvas.width / (2 * dpr * scale);
  const buffY =
    unscaledY + mapCenter.y - renderCanvas.height / (2 * dpr * scale);

  return { x: buffX, y: buffY };
};

export const drawRuler = (
  ctx: CanvasRenderingContext2D,
  offsetPoint: Position,
  scale: number,
  pixelSize: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  const dpr = window.devicePixelRatio;

  // 绘制刻度尺
  ctx.save();
  ctx.scale(1 / dpr, 1 / dpr);

  // Adjusting the starting point based on the center, scale, and offset
  const scaledPixelSize = pixelSize * scale * dpr;
  const halfWidth = (canvasWidth / 2) * dpr;
  const halfHeight = (canvasHeight / 2) * dpr;

  const startX = (halfWidth - offsetPoint.x * dpr * scale) % scaledPixelSize;
  const startY = (halfHeight - offsetPoint.y * dpr * scale) % scaledPixelSize;

  // Adjust alpha value based on scale to create a fade effect
  const alpha = Math.max((scale - 0.5) * 2, 0);
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.font = `${10 * dpr}px Arial`;
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = dpr;

  // Draw horizontal lines and labels
  for (
    let x = startX - scaledPixelSize;
    x < canvasWidth * dpr;
    x += scaledPixelSize
  ) {
    const label = Math.round(
      (x - halfWidth + offsetPoint.x * dpr * scale) / scaledPixelSize
    );
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight * dpr);
    if (label % 10 === 0) {
      ctx.fillText(label.toString(), x + 2, 20 * dpr);
    }
  }

  // Draw vertical lines and labels
  for (
    let y = startY - scaledPixelSize;
    y < canvasHeight * dpr;
    y += scaledPixelSize
  ) {
    const label = Math.round(
      (y - halfHeight + offsetPoint.y * dpr * scale) / scaledPixelSize
    );
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth * dpr, y);
    if (label % 10 === 0) {
      ctx.fillText(label.toString(), 12 * dpr, y + 10);
    }
  }

  ctx.stroke();
  ctx.restore();
};

import { Point, Ray, Segment } from "@/types/CanvasTypes";

export const drawWallLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  angle: number,
  length: number
) => {
  const endX = startX + length * Math.cos(angle);
  const endY = startY + length * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};
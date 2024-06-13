import { Point, Ray, Segment } from "@/types/CanvasTypes";

/**
 * 绘制圆形的函数
 * @param x 圆心的 x 坐标
 * @param y 圆心的 y 坐标
 * @param radius 圆的半径
 * @param color 圆的颜色 (格式: 'gray' 或 '#RRGGBB')
 * @param alpha 透明度 (0.0 到 1.0)
 */
export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
};

// 检测碰撞
export const detectCollision = (
  firmCtx: CanvasRenderingContext2D,
  firmCircleX: number,
  firmCircleY: number,
  actCtx: CanvasRenderingContext2D,
  actCircleX: number,
  actCircleY: number,
  radius: number
) => {
  const firmData = firmCtx.getImageData(
    firmCircleX - radius,
    firmCircleY - radius,
    radius * 2,
    radius * 2
  ).data;
  const actData = actCtx.getImageData(
    actCircleX - radius,
    actCircleY - radius,
    radius * 2,
    radius * 2
  ).data;

  for (let j = 0; j < radius * 2; j++) {
    for (let i = 0; i < radius * 2; i++) {
      const dx = i - radius;
      const dy = j - radius;
      if (dx * dx + dy * dy <= radius * radius) {
        const index = (j * radius * 2 + i) * 4;
        const actAlpha = actData[index + 3];
        const firmAlpha = firmData[index + 3];
        if (actAlpha > 0 && firmAlpha > 0) {
          return { collision: true, dx: dx, dy: dy };
        }
      }
    }
  }
  return { collision: false, dx: 0, dy: 0 };
};

export const detectLightCollision = (
  firmCtx: CanvasRenderingContext2D,
  firmCircleX: number,
  firmCircleY: number,
  lightCtx: CanvasRenderingContext2D,
  lightCircleX: number,
  lightCircleY: number,
  radius: number
) => {
  const firmData = firmCtx.getImageData(
    firmCircleX - radius,
    firmCircleY - radius,
    radius * 2,
    radius * 2
  ).data;
  const lightData = lightCtx.getImageData(
    lightCircleX - radius,
    lightCircleY - radius,
    radius * 2,
    radius * 2
  ).data;

  let collisionDetected = false;
  const maskImageData = lightCtx.createImageData(radius * 2, radius * 2);
  const maskData = maskImageData.data;

  for (let j = 0; j < radius * 2; j++) {
    for (let i = 0; i < radius * 2; i++) {
      const dx = i - radius;
      const dy = j - radius;
      if (dx * dx + dy * dy <= radius * radius) {
        const index = (j * radius * 2 + i) * 4;
        const actAlpha = lightData[index + 3];
        const firmAlpha = firmData[index + 3];
        if (actAlpha > 0 && firmAlpha > 0) {
          collisionDetected = true;
          maskData[index] = 0; // Red
          maskData[index + 1] = 0; // Green
          maskData[index + 2] = 0; // Blue
          maskData[index + 3] = 255; // Alpha (fully opaque)
        } else {
          // Set the alpha to 0 if not masked
          maskData[index + 3] = 0;
        }
      }
    }
  }

  // Apply the mask to the light context
  lightCtx.putImageData(
    maskImageData,
    lightCircleX - radius,
    lightCircleY - radius
  );
};

// 处理碰撞检测
export const handleCollision = (
  actCtx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  firmCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  velocityX: number,
  velocityY: number
) => {
  let newX = x + velocityX;
  let newY = y + velocityY;

  const collision = detectCollision(
    actCtx,
    centerX,
    centerY,
    firmCtx,
    newX,
    newY,
    radius
  );

  if (collision.collision) {
    const normalX = collision.dx;
    const normalY = collision.dy;
    const dotProduct = velocityX * normalX + velocityY * normalY;

    const bounceDamping = 0.0005;
    velocityX -= 2 * dotProduct * normalX * bounceDamping;
    velocityY -= 2 * dotProduct * normalY * bounceDamping;

    newX = x + velocityX;
    newY = y + velocityY;

    const secondCollision = detectCollision(
      actCtx,
      centerX,
      centerY,
      firmCtx,
      newX,
      newY,
      radius
    );

    if (secondCollision.collision) {
      return { x, y, velocityX: 0, velocityY: 0 };
    }
  }

  return { x: newX, y: newY, velocityX, velocityY };
};

// 绘制圆形灯光
export const drawCircularLight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)"); // 中心更亮
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)"); // 渐变到稍暗
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)"); // 再次渐变
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // 边缘完全透明

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
};

// 绘制扇形灯光
export const drawSectorLight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  direction: number,
  length: number
) => {
  const startAngle = direction - angle / 2;
  const endAngle = direction + angle / 2;

  // 创建径向渐变
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, length);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // 中心更亮
  gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.8)"); // 快速变暗
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.4)"); // 渐变到更暗
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)"); // 继续变暗
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // 边缘完全透明

  // 设置合成操作，使光线效果与背景混合
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;

  // 设置阴影效果，使边缘更模糊
  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

  // 绘制扇形光线
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, length, startAngle, endAngle, false);
  ctx.closePath();
  ctx.fill();

  // 恢复默认合成操作
  ctx.globalCompositeOperation = "source-over";

  // 重置阴影
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
};

export const isPointInSector = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  angle: number,
  direction: number,
  radius: number
) => {
  let dx = px - cx;
  let dy = py - cy;
  let distanceSquared = dx * dx + dy * dy;
  if (distanceSquared > radius * radius) {
    return false;
  }
  let pointAngle = Math.atan2(dy, dx);
  if (pointAngle < 0) {
    pointAngle += 2 * Math.PI;
  }
  let startAngle = direction;
  let endAngle = direction + angle;
  if (endAngle > 2 * Math.PI) {
    return pointAngle >= startAngle || pointAngle <= endAngle - 2 * Math.PI;
  } else {
    return pointAngle >= startAngle && pointAngle <= endAngle;
  }
};

export const drawLine = (
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

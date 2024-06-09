export const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};

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
  color: string,
  alpha: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.restore();
};

// 绘制扇形灯光
export const applySectorLight = (
  ctx: CanvasRenderingContext2D,
  maskX: number,
  maskY: number,
  maskRadius: number,
  sectorAngle: number, // 扇形角度，单位为度
  sectorRotationAngle: number, // 扇形旋转角度，单位为度
  intensity: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const sectorAngleRad = (sectorAngle / 2) * (Math.PI / 180); // 扇形半角，单位转换为弧度
  const sectorRotationRad = sectorRotationAngle * (Math.PI / 180); // 扇形旋转角度，单位转换为弧度

  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      const i = (y * ctx.canvas.width + x) * 4;

      const dx = x - maskX;
      const dy = y - maskY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 计算相对于向上方向（正y轴）的角度，并应用旋转
      let angle = Math.atan2(dy, dx) - sectorRotationRad;

      // 将角度调整到 [-PI, PI] 范围内
      if (angle < -Math.PI) angle += 2 * Math.PI;
      if (angle > Math.PI) angle -= 2 * Math.PI;

      // 检查是否在扇形内
      const inSector = angle >= -sectorAngleRad && angle <= sectorAngleRad;

      if (distance > maskRadius && !inSector) {
        const fadeFactor = Math.max(
          0,
          Math.min(1, (distance - maskRadius) / maskRadius)
        );
        const darkness = 1 - intensity * fadeFactor;

        data[i] *= darkness;
        data[i + 1] *= darkness;
        data[i + 2] *= darkness;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

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

export const drawSectorLight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  direction: number
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

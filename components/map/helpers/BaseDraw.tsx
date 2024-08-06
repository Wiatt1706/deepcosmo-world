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

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  offsetPoint: Position,
  scale: number,
  pixelSize: number,
  canvasWidth: number,
  canvasHeight: number,
  rectSize?: number
) => {
  const dpr = window.devicePixelRatio;
  const scaledPixelSize = pixelSize * scale * dpr;
  const halfWidth = (canvasWidth / 2) * dpr;
  const halfHeight = (canvasHeight / 2) * dpr;

  const startX = (halfWidth - offsetPoint.x * dpr * scale) % scaledPixelSize;
  const startY = (halfHeight - offsetPoint.y * dpr * scale) % scaledPixelSize;

  ctx.save();
  ctx.scale(1 / dpr, 1 / dpr);

  // Calculate center and rectangle half size if rectSize is provided
  const centerX = halfWidth - offsetPoint.x * dpr * scale;
  const centerY = halfHeight - offsetPoint.y * dpr * scale;
  const rectHalfSize = rectSize ? (rectSize / 2) * dpr * scale : 0;

  // Draw range rectangle if rectSize is provided
  if (rectSize) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(
      centerX - rectHalfSize,
      centerY - rectHalfSize,
      rectSize * dpr * scale,
      rectSize * dpr * scale
    );

    // Clip the drawing area to within the rectangle
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      centerX - rectHalfSize,
      centerY - rectHalfSize,
      rectSize * dpr * scale,
      rectSize * dpr * scale
    );
    ctx.clip();
  }

  // Draw grid lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = dpr;
  ctx.globalAlpha = Math.max((scale - 0.3) * 2, 0);
  ctx.beginPath();

  for (
    let x = startX - scaledPixelSize;
    x < canvasWidth * dpr;
    x += scaledPixelSize
  ) {
    ctx.moveTo(x, rectSize ? centerY - rectHalfSize : 0);
    ctx.lineTo(x, rectSize ? centerY + rectHalfSize : canvasHeight * dpr);
  }

  for (
    let y = startY - scaledPixelSize;
    y < canvasHeight * dpr;
    y += scaledPixelSize
  ) {
    ctx.moveTo(rectSize ? centerX - rectHalfSize : 0, y);
    ctx.lineTo(rectSize ? centerX + rectHalfSize : canvasWidth * dpr, y);
  }

  ctx.stroke();
  ctx.globalAlpha = 1;

  if (rectSize) {
    ctx.restore(); // Restore from clipping
  }

  ctx.restore();
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
  const scaledPixelSize = pixelSize * scale * dpr;
  const halfWidth = (canvasWidth / 2) * dpr;
  const halfHeight = (canvasHeight / 2) * dpr;

  const startX = (halfWidth - offsetPoint.x * dpr * scale) % scaledPixelSize;
  const startY = (halfHeight - offsetPoint.y * dpr * scale) % scaledPixelSize;

  ctx.save();
  ctx.scale(1 / dpr, 1 / dpr);

  // Draw ruler background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvasWidth * dpr, 15 * dpr);
  ctx.fillRect(0, 0, 15 * dpr, canvasHeight * dpr);

  // Draw ruler border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(15 * dpr, 0);
  ctx.lineTo(15 * dpr, canvasHeight * dpr);
  ctx.moveTo(0, 15 * dpr);
  ctx.lineTo(canvasWidth * dpr, 15 * dpr);
  ctx.stroke();

  // Draw ticks and labels
  ctx.strokeStyle = "#808080";
  ctx.fillStyle = "#808080";
  ctx.font = `${10 * dpr}px Arial`;
  ctx.lineWidth = 1 * dpr;

  const drawTicksAndLabels = (
    start: number,
    end: number,
    half: number,
    offset: number,
    axis: "x" | "y"
  ) => {
    for (let pos = start - scaledPixelSize; pos < end; pos += scaledPixelSize) {
      const label = Math.round(
        (pos - half + offset * dpr * scale) / scaledPixelSize
      );
      if (pos > 20 * dpr && pos % scaledPixelSize !== 0) {
        ctx.beginPath();
        if (axis === "x") {
          ctx.moveTo(pos, 15 * dpr);
          ctx.lineTo(pos, 10 * dpr);
        } else {
          ctx.moveTo(15 * dpr, pos);
          ctx.lineTo(10 * dpr, pos);
        }
        if (label % 10 === 0) {
          if (axis === "x") {
            ctx.lineTo(pos, 0);
            ctx.fillText(label.toString(), pos + 5, 10 * dpr);
          } else {
            ctx.lineTo(0, pos);
            ctx.save();
            ctx.translate(15 * dpr, pos);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(label.toString(), 5 * dpr, -6 * dpr);
            ctx.restore();
          }
        }
        ctx.stroke();
      }
    }
  };

  drawTicksAndLabels(startX, canvasWidth * dpr, halfWidth, offsetPoint.x, "x");
  drawTicksAndLabels(
    startY,
    canvasHeight * dpr,
    halfHeight,
    offsetPoint.y,
    "y"
  );

  ctx.restore();
};

// export const drawRuler = (
//   ctx: CanvasRenderingContext2D,
//   offsetPoint: Position,
//   scale: number,
//   pixelSize: number,
//   canvasWidth: number,
//   canvasHeight: number,
//   rectSize?: number
// ) => {
//   const dpr = window.devicePixelRatio;
//   const scaledPixelSize = pixelSize * scale * dpr;
//   const halfWidth = (canvasWidth / 2) * dpr;
//   const halfHeight = (canvasHeight / 2) * dpr;

//   const startX = (halfWidth - offsetPoint.x * dpr * scale) % scaledPixelSize;
//   const startY = (halfHeight - offsetPoint.y * dpr * scale) % scaledPixelSize;

//   ctx.save();
//   ctx.scale(1 / dpr, 1 / dpr);

//   // Calculate center and rectangle half size if rectSize is provided
//   const centerX = halfWidth - offsetPoint.x * dpr * scale;
//   const centerY = halfHeight - offsetPoint.y * dpr * scale;
//   const rectHalfSize = rectSize ? (rectSize / 2) * dpr * scale : 0;

//   // Draw range rectangle if rectSize is provided
//   if (rectSize) {
//     ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
//     ctx.lineWidth = 1 * dpr;
//     ctx.strokeRect(
//       centerX - rectHalfSize,
//       centerY - rectHalfSize,
//       rectSize * dpr * scale,
//       rectSize * dpr * scale
//     );

//     // Clip the drawing area to within the rectangle
//     ctx.save();
//     ctx.beginPath();
//     ctx.rect(
//       centerX - rectHalfSize,
//       centerY - rectHalfSize,
//       rectSize * dpr * scale,
//       rectSize * dpr * scale
//     );
//     ctx.clip();
//   }

//   // Draw grid lines
//   ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
//   ctx.lineWidth = dpr;
//   ctx.globalAlpha = Math.max((scale - 0.3) * 2, 0);
//   ctx.beginPath();

//   for (
//     let x = startX - scaledPixelSize;
//     x < canvasWidth * dpr;
//     x += scaledPixelSize
//   ) {
//     ctx.moveTo(x, rectSize ? centerY - rectHalfSize : 0);
//     ctx.lineTo(x, rectSize ? centerY + rectHalfSize : canvasHeight * dpr);
//   }

//   for (
//     let y = startY - scaledPixelSize;
//     y < canvasHeight * dpr;
//     y += scaledPixelSize
//   ) {
//     ctx.moveTo(rectSize ? centerX - rectHalfSize : 0, y);
//     ctx.lineTo(rectSize ? centerX + rectHalfSize : canvasWidth * dpr, y);
//   }

//   ctx.stroke();
//   ctx.globalAlpha = 1;

//   if (rectSize) {
//     ctx.restore(); // Restore from clipping
//   }

//   // Draw ruler background
//   ctx.fillStyle = "#f8fafc";
//   ctx.fillRect(0, 0, canvasWidth * dpr, 15 * dpr);
//   ctx.fillRect(0, 0, 15 * dpr, canvasHeight * dpr);

//   // Draw ruler border
//   ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
//   ctx.lineWidth = 1;
//   ctx.beginPath();
//   ctx.moveTo(15 * dpr, 0);
//   ctx.lineTo(15 * dpr, canvasHeight * dpr);
//   ctx.moveTo(0, 15 * dpr);
//   ctx.lineTo(canvasWidth * dpr, 15 * dpr);
//   ctx.stroke();

//   // Draw ticks and labels
//   ctx.strokeStyle = "#808080";
//   ctx.fillStyle = "#808080";
//   ctx.font = `${10 * dpr}px Arial`;
//   ctx.lineWidth = 1 * dpr;

//   const drawTicksAndLabels = (
//     start: number,
//     end: number,
//     half: number,
//     offset: number,
//     axis: "x" | "y"
//   ) => {
//     for (let pos = start - scaledPixelSize; pos < end; pos += scaledPixelSize) {
//       const label = Math.round(
//         (pos - half + offset * dpr * scale) / scaledPixelSize
//       );
//       if (pos > 20 * dpr && pos % scaledPixelSize !== 0) {
//         ctx.beginPath();
//         if (axis === "x") {
//           ctx.moveTo(pos, 15 * dpr);
//           ctx.lineTo(pos, 10 * dpr);
//         } else {
//           ctx.moveTo(15 * dpr, pos);
//           ctx.lineTo(10 * dpr, pos);
//         }
//         if (label % 10 === 0) {
//           if (axis === "x") {
//             ctx.lineTo(pos, 0);
//             ctx.fillText(label.toString(), pos + 5, 10 * dpr);
//           } else {
//             ctx.lineTo(0, pos);
//             ctx.save();
//             ctx.translate(15 * dpr, pos);
//             ctx.rotate(-Math.PI / 2);
//             ctx.fillText(label.toString(), 5 * dpr, -6 * dpr);
//             ctx.restore();
//           }
//         }
//         ctx.stroke();
//       }
//     }
//   };

//   drawTicksAndLabels(startX, canvasWidth * dpr, halfWidth, offsetPoint.x, "x");
//   drawTicksAndLabels(
//     startY,
//     canvasHeight * dpr,
//     halfHeight,
//     offsetPoint.y,
//     "y"
//   );

//   ctx.restore();
// };

export const drawAim = (
  ctx: CanvasRenderingContext2D,
  lineLength: number,
  mouseScaledX: number,
  mouseScaledY: number,
  mouseScaledWidth: number,
  mouseScaledHeight: number
) => {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 111, 239, 0.8)";
  ctx.lineWidth = 2; // 调整线宽

  // 绘制中心十字线
  ctx.beginPath();
  ctx.moveTo(mouseScaledX + mouseScaledWidth / 2, mouseScaledY);
  ctx.lineTo(
    mouseScaledX + mouseScaledWidth / 2,
    mouseScaledY + mouseScaledHeight
  );
  ctx.moveTo(mouseScaledX, mouseScaledY + mouseScaledHeight / 2);
  ctx.lineTo(
    mouseScaledX + mouseScaledWidth,
    mouseScaledY + mouseScaledHeight / 2
  );
  ctx.stroke();

  // 绘制四个角的短线段
  const corners = [
    [mouseScaledX, mouseScaledY],
    [mouseScaledX + mouseScaledWidth, mouseScaledY],
    [mouseScaledX, mouseScaledY + mouseScaledHeight],
    [mouseScaledX + mouseScaledWidth, mouseScaledY + mouseScaledHeight],
  ];

  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (x === mouseScaledX ? lineLength : -lineLength), y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + (y === mouseScaledY ? lineLength : -lineLength));
    ctx.stroke();
  });

  ctx.restore();
};

import {
  Character,
  Geometry,
  Point,
  Segment,
  Weapon,
} from "@/types/CanvasTypes";
import { drawReloadAnimation, fireWeapon, reloadWeapon } from "./FightingDraw";

export const GeometryList: Geometry[] = [
  {
    name: "Polygon #1",
    type: 0,
    segments: [
      {
        a: {
          x: 0,
          y: 0,
        },
        b: {
          x: 2428,
          y: -2,
        },
      },
      {
        a: {
          x: 2428,
          y: -2,
        },
        b: {
          x: 2430,
          y: 1666,
        },
      },
      {
        a: {
          x: 2430,
          y: 1666,
        },
        b: {
          x: 2,
          y: 1664,
        },
      },
      {
        a: {
          x: 2,
          y: 1664,
        },
        b: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
  {
    name: "Polygon #1",
    type: 0,
    segments: [
      {
        a: {
          x: 1021,
          y: 856,
        },
        b: {
          x: 1020,
          y: 740,
        },
      },
      {
        a: {
          x: 1020,
          y: 740,
        },
        b: {
          x: 1275,
          y: 739,
        },
      },
      {
        a: {
          x: 1275,
          y: 739,
        },
        b: {
          x: 1278,
          y: 678,
        },
      },
      {
        a: {
          x: 1278,
          y: 678,
        },
        b: {
          x: 1299,
          y: 678,
        },
      },
      {
        a: {
          x: 1299,
          y: 678,
        },
        b: {
          x: 1299,
          y: 833,
        },
      },
      {
        a: {
          x: 1299,
          y: 833,
        },
        b: {
          x: 1393,
          y: 834,
        },
      },
      {
        a: {
          x: 1393,
          y: 834,
        },
        b: {
          x: 1395,
          y: 855,
        },
      },
      {
        a: {
          x: 1395,
          y: 855,
        },
        b: {
          x: 1277,
          y: 856,
        },
      },
      {
        a: {
          x: 1277,
          y: 856,
        },
        b: {
          x: 1277,
          y: 761,
        },
      },
      {
        a: {
          x: 1277,
          y: 761,
        },
        b: {
          x: 1043,
          y: 760,
        },
      },
      {
        a: {
          x: 1043,
          y: 760,
        },
        b: {
          x: 1043,
          y: 856,
        },
      },
      {
        a: {
          x: 1043,
          y: 856,
        },
        b: {
          x: 1021,
          y: 856,
        },
      },
    ],
  },
  {
    name: "Polygon #2",
    type: 0,
    segments: [
      {
        a: {
          x: 1277,
          y: 599,
        },
        b: {
          x: 1276,
          y: 550,
        },
      },
      {
        a: {
          x: 1276,
          y: 550,
        },
        b: {
          x: 1585,
          y: 548,
        },
      },
      {
        a: {
          x: 1585,
          y: 548,
        },
        b: {
          x: 1587,
          y: 666,
        },
      },
      {
        a: {
          x: 1587,
          y: 666,
        },
        b: {
          x: 1565,
          y: 665,
        },
      },
      {
        a: {
          x: 1565,
          y: 665,
        },
        b: {
          x: 1566,
          y: 570,
        },
      },
      {
        a: {
          x: 1566,
          y: 570,
        },
        b: {
          x: 1298,
          y: 569,
        },
      },
      {
        a: {
          x: 1298,
          y: 569,
        },
        b: {
          x: 1299,
          y: 601,
        },
      },
      {
        a: {
          x: 1299,
          y: 601,
        },
        b: {
          x: 1277,
          y: 599,
        },
      },
    ],
  },
  {
    name: "Polygon #3",
    type: 0,
    segments: [
      {
        a: {
          x: 1564,
          y: 739,
        },
        b: {
          x: 1585,
          y: 740,
        },
      },
      {
        a: {
          x: 1585,
          y: 740,
        },
        b: {
          x: 1587,
          y: 859,
        },
      },
      {
        a: {
          x: 1587,
          y: 859,
        },
        b: {
          x: 1471,
          y: 858,
        },
      },
      {
        a: {
          x: 1471,
          y: 858,
        },
        b: {
          x: 1471,
          y: 836,
        },
      },
      {
        a: {
          x: 1471,
          y: 836,
        },
        b: {
          x: 1565,
          y: 835,
        },
      },
      {
        a: {
          x: 1565,
          y: 835,
        },
        b: {
          x: 1564,
          y: 739,
        },
      },
    ],
  },
  {
    name: "Polygon #4",
    type: 0,
    segments: [
      {
        a: {
          x: 1539,
          y: 939,
        },
        b: {
          x: 1579,
          y: 938,
        },
      },
      {
        a: {
          x: 1579,
          y: 938,
        },
        b: {
          x: 1581,
          y: 980,
        },
      },
      {
        a: {
          x: 1581,
          y: 980,
        },
        b: {
          x: 1539,
          y: 980,
        },
      },
      {
        a: {
          x: 1539,
          y: 980,
        },
        b: {
          x: 1539,
          y: 939,
        },
      },
    ],
  },
  {
    name: "Polygon #5",
    type: 0,
    segments: [
      {
        a: {
          x: 1048,
          y: 826,
        },
        b: {
          x: 1271,
          y: 826,
        },
      },
      {
        a: {
          x: 1271,
          y: 826,
        },
        b: {
          x: 1271,
          y: 772,
        },
      },
      {
        a: {
          x: 1271,
          y: 772,
        },
        b: {
          x: 1047,
          y: 771,
        },
      },
      {
        a: {
          x: 1047,
          y: 771,
        },
        b: {
          x: 1048,
          y: 826,
        },
      },
    ],
  },
  {
    name: "Polygon #6",
    type: 0,
    segments: [
      {
        a: {
          x: 1107,
          y: 933,
        },
        b: {
          x: 1267,
          y: 909,
        },
      },
      {
        a: {
          x: 1267,
          y: 909,
        },
        b: {
          x: 1277,
          y: 968,
        },
      },
      {
        a: {
          x: 1277,
          y: 968,
        },
        b: {
          x: 1118,
          y: 993,
        },
      },
      {
        a: {
          x: 1118,
          y: 993,
        },
        b: {
          x: 1107,
          y: 933,
        },
      },
    ],
  },
  {
    name: "Polygon #7",
    type: 0,
    segments: [
      {
        a: {
          x: 1020,
          y: 996,
        },
        b: {
          x: 1041,
          y: 998,
        },
      },
      {
        a: {
          x: 1041,
          y: 998,
        },
        b: {
          x: 1042,
          y: 1062,
        },
      },
      {
        a: {
          x: 1042,
          y: 1062,
        },
        b: {
          x: 1587,
          y: 1060,
        },
      },
      {
        a: {
          x: 1587,
          y: 1060,
        },
        b: {
          x: 1586,
          y: 1083,
        },
      },
      {
        a: {
          x: 1586,
          y: 1083,
        },
        b: {
          x: 1021,
          y: 1083,
        },
      },
      {
        a: {
          x: 1021,
          y: 1083,
        },
        b: {
          x: 1020,
          y: 996,
        },
      },
    ],
  },
  {
    name: "Polygon #8",
    type: 0,
    segments: [
      {
        a: {
          x: 1396,
          y: 678,
        },
        b: {
          x: 1452,
          y: 654,
        },
      },
      {
        a: {
          x: 1452,
          y: 654,
        },
        b: {
          x: 1467,
          y: 692,
        },
      },
      {
        a: {
          x: 1467,
          y: 692,
        },
        b: {
          x: 1412,
          y: 716,
        },
      },
      {
        a: {
          x: 1412,
          y: 716,
        },
        b: {
          x: 1396,
          y: 678,
        },
      },
    ],
  },
  {
    name: "Polygon #9",
    type: 0,
    segments: [
      {
        a: {
          x: 1487,
          y: 601,
        },
        b: {
          x: 1519,
          y: 607,
        },
      },
      {
        a: {
          x: 1519,
          y: 607,
        },
        b: {
          x: 1515,
          y: 638,
        },
      },
      {
        a: {
          x: 1515,
          y: 638,
        },
        b: {
          x: 1483,
          y: 633,
        },
      },
      {
        a: {
          x: 1483,
          y: 633,
        },
        b: {
          x: 1487,
          y: 601,
        },
      },
    ],
  },
  {
    name: "Polygon #10",
    type: 0,
    segments: [
      {
        a: {
          x: 486,
          y: 533,
        },
        b: {
          x: 602,
          y: 533,
        },
      },
      {
        a: {
          x: 602,
          y: 533,
        },
        b: {
          x: 603,
          y: 788,
        },
      },
      {
        a: {
          x: 603,
          y: 788,
        },
        b: {
          x: 664,
          y: 789,
        },
      },
      {
        a: {
          x: 664,
          y: 789,
        },
        b: {
          x: 664,
          y: 810,
        },
      },
      {
        a: {
          x: 664,
          y: 810,
        },
        b: {
          x: 509,
          y: 811,
        },
      },
      {
        a: {
          x: 509,
          y: 811,
        },
        b: {
          x: 509,
          y: 905,
        },
      },
      {
        a: {
          x: 509,
          y: 905,
        },
        b: {
          x: 488,
          y: 905,
        },
      },
      {
        a: {
          x: 488,
          y: 905,
        },
        b: {
          x: 486,
          y: 787,
        },
      },
      {
        a: {
          x: 486,
          y: 787,
        },
        b: {
          x: 582,
          y: 787,
        },
      },
      {
        a: {
          x: 582,
          y: 787,
        },
        b: {
          x: 581,
          y: 554,
        },
      },
      {
        a: {
          x: 581,
          y: 554,
        },
        b: {
          x: 487,
          y: 556,
        },
      },
      {
        a: {
          x: 487,
          y: 556,
        },
        b: {
          x: 486,
          y: 533,
        },
      },
    ],
  },
];

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

export const drawHealthBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  radius: number,
  direction: number
) => {
  const fullArc = (2 * Math.PI) / 2; // 三分之一圆
  const startAngle = (direction * Math.PI) / 180;
  const endAngle = startAngle + fullArc * progress;
  const fullEndAngle = startAngle + fullArc;

  ctx.save();

  // 绘制红色代表扣除血量的弧线
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, fullEndAngle);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 绘制绿色代表剩余血量的弧线
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.restore();
};

export const drawDashedRing = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius = 10,
  dashLength = 10,
  color = "red",
  rotationAngle = 0
) => {
  const circumference = 2 * Math.PI * radius;
  const numDashes = Math.floor(circumference / dashLength);
  const adjustedDashLength = circumference / numDashes;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotationAngle * Math.PI) / 180);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([adjustedDashLength, adjustedDashLength]);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.restore();
};

export const calculateRectangleVertices = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 计算这个向量的长度
  const length = Math.sqrt(dx * dx + dy * dy);

  // 计算垂直于这个向量的单位向量（归一化）
  const ux = -dy / length;
  const uy = dx / length;

  // 计算矩形宽度的一半，以便在中线的两侧应用
  const halfWidth = w / 2;

  // 计算将中间点向内移动的向量
  const inwardFactor = -halfWidth / length;

  // 将中间点向内调整半个宽度
  const adjustedX1 = x1 + dx * inwardFactor;
  const adjustedY1 = y1 + dy * inwardFactor;
  const adjustedX2 = x2 - dx * inwardFactor;
  const adjustedY2 = y2 - dy * inwardFactor;

  // 计算矩形的四个顶点
  const x3 = adjustedX1 + ux * halfWidth;
  const y3 = adjustedY1 + uy * halfWidth;

  const x4 = adjustedX1 - ux * halfWidth;
  const y4 = adjustedY1 - uy * halfWidth;

  const x5 = adjustedX2 + ux * halfWidth;
  const y5 = adjustedY2 + uy * halfWidth;

  const x6 = adjustedX2 - ux * halfWidth;
  const y6 = adjustedY2 - uy * halfWidth;

  // 计算矩形的四个顶点坐标
  const topLeft = { x: x3, y: y3 };
  const topRight = { x: x4, y: y4 };
  const bottomRight = { x: x6, y: y6 };
  const bottomLeft = { x: x5, y: y5 };

  return [
    { a: topLeft, b: topRight },
    { a: topRight, b: bottomRight },
    { a: bottomRight, b: bottomLeft },
    { a: bottomLeft, b: topLeft },
  ];
};

const getMidpointPoint = (point1: Point, point2: Point) => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  };
};

export const generateRectangleAndMerge = (
  segments: Segment[],
  x1: number,
  y1: number,
  w: number
) => {
  const { x: x2, y: y2 } = getMidpointPoint(
    segments[segments.length - 2].a,
    segments[segments.length - 2].b
  );
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 计算这个向量的长度
  const length = Math.sqrt(dx * dx + dy * dy);

  // 计算垂直于这个向量的单位向量（归一化）
  const ux = -dy / length;
  const uy = dx / length;

  // 计算矩形宽度的一半，以便在中线的两侧应用
  const halfWidth = w / 2;

  // 计算将中间点向内移动的向量
  const inwardFactor = -halfWidth / length;

  // 将中间点向内调整半个宽度
  const adjustedX1 = x1 + dx;
  const adjustedY1 = y1 + dy;
  const adjustedX2 = x2 - dx;
  const adjustedY2 = y2 - dy;

  // 计算矩形的四个顶点
  const x3 = adjustedX1 + ux * halfWidth;
  const y3 = adjustedY1 + uy * halfWidth;

  const x4 = adjustedX1 - ux * halfWidth;
  const y4 = adjustedY1 - uy * halfWidth;

  const x5 = adjustedX2 + ux * halfWidth;
  const y5 = adjustedY2 + uy * halfWidth;

  const x6 = adjustedX2 - ux * halfWidth;
  const y6 = adjustedY2 - uy * halfWidth;

  // 计算矩形的四个顶点坐标
  const topLeft = { x: x3, y: y3 };
  const topRight = { x: x4, y: y4 };
  const bottomRight = { x: x6, y: y6 };
  const bottomLeft = { x: x5, y: y5 };

  return [
    { a: topLeft, b: topRight },
    { a: topRight, b: bottomRight },
    { a: bottomRight, b: bottomLeft },
    { a: bottomLeft, b: topLeft },
  ];
};

// 绘制角色
export const drawPlayer = (
  renderCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  player: Character,
  playerImage: HTMLImageElement,
  legOffsetX: number,
  legOffsetY: number,
  scale: number
) => {
  if (!playerImage) return;

  drawCircle(
    renderCtx,
    x,
    y,
    player.radius * scale,
    "rgba(255, 255, 255, 0.5)"
  );

  drawDashedRing(
    renderCtx,
    x,
    y,
    player.radius * 10 * scale,
    20,
    "rgba(210, 210, 210, 0.2)",
    player.angle
  );

  renderCtx.save();
  renderCtx.translate(x, y);

  const legRadius = (player.radius / 3) * scale; // 腿部圆形半径
  // 绘制腿部
  renderCtx.beginPath();
  renderCtx.ellipse(
    -legOffsetX,
    legOffsetY,
    legRadius,
    legRadius + 2,
    0,
    0,
    2 * Math.PI
  );
  renderCtx.fillStyle = "rgba(0, 0, 0, 0.6)";
  renderCtx.fill();
  renderCtx.closePath();

  renderCtx.beginPath();
  renderCtx.ellipse(
    legOffsetX,
    -legOffsetY,
    legRadius,
    legRadius + 2,
    0,
    0,
    2 * Math.PI
  );
  renderCtx.fillStyle = "rgba(0, 0, 0, 0.6)";
  renderCtx.fill();
  renderCtx.closePath();

  renderCtx.rotate(-Math.PI / 2);
  // 绘制角色图像
  renderCtx.drawImage(
    playerImage,
    (-playerImage.width * scale) / 2,
    (-playerImage.height * scale) / 2,
    playerImage.width * scale,
    playerImage.height * scale
  );

  renderCtx.restore();
};

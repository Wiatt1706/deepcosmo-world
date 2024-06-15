import { Geometry, Point, Ray, Segment } from "@/types/CanvasTypes";
import { resetGeometry } from "@/components/canvas/helpers/PhysicsDraw";

// 判断点是否在线段范围内
function isPointInRange(point: Point, radius: number, segment: Segment) {
  const { x: x1, y: y1 } = segment.a;
  const { x: x2, y: y2 } = segment.b;
  const { x: px, y: py } = point;

  // 计算线段长度
  const lineLenSq = (x2 - x1) ** 2 + (y2 - y1) ** 2;

  // 投影点
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLenSq;
  t = Math.max(0, Math.min(1, t));

  // 计算投影点坐标
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);

  // 计算投影点到目标点的距离
  const distSq = (px - projX) ** 2 + (py - projY) ** 2;

  // 检查距离是否在半径范围内
  return distSq <= radius ** 2;
}

// 过滤几何体（类型为1且在半径范围内）
export function filterSegments(
  segmentsList: Geometry[],
  point: Point,
  radius: number
) {
  return segmentsList.filter((segmentGroup) => {
    return (
      segmentGroup.type === 1 ||
      segmentGroup.segments.some((segment) =>
        isPointInRange(point, radius, segment)
      )
    );
  });
}

// 计算两条线段的交点
export const getIntersection = (ray: Ray, segment: Segment): Point | null => {
  const r_px = ray.a.x;
  const r_py = ray.a.y;
  const r_dx = ray.b.x - ray.a.x;
  const r_dy = ray.b.y - ray.a.y;

  const s_px = segment.a.x;
  const s_py = segment.a.y;
  const s_dx = segment.b.x - segment.a.x;
  const s_dy = segment.b.y - segment.a.y;

  const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
  const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
  if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
    return null;
  }

  const T2 =
    (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
  const T1 = (s_px + s_dx * T2 - r_px) / r_dx;

  if (T1 < 0 || T2 < 0 || T2 > 1) return null;

  return {
    x: r_px + r_dx * T1,
    y: r_py + r_dy * T1,
    param: T1,
  };
};

// 获取视线多边体
export const getSightPolygon = (
  geometryList: Geometry[],
  sightX: number,
  sightY: number
): Point[] => {
  const segments = geometryList.flatMap((geom) => geom.segments);
  const points: Point[] = segments.flatMap((seg) => [seg.a, seg.b]);

  const uniquePoints = Array.from(new Set(points.map((p) => `${p.x},${p.y}`)))
    .map((str) => str.split(",").map(Number))
    .map(([x, y]) => ({ x, y }));

  const uniqueAngles = uniquePoints.flatMap((p) => {
    const angle = Math.atan2(p.y - sightY, p.x - sightX);
    return [angle - 0.00001, angle, angle + 0.00001];
  });

  const intersects = uniqueAngles
    .map((angle) => {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const ray: Ray = {
        a: { x: sightX, y: sightY },
        b: { x: sightX + dx, y: sightY + dy },
      };

      const closestIntersect = segments
        .map((seg) => getIntersection(ray, seg))
        .filter(Boolean)
        .sort((a, b) => a!.param! - b!.param!)[0];

      if (closestIntersect) {
        closestIntersect.angle = angle;
        return closestIntersect;
      }

      return null;
    })
    .filter(Boolean) as Point[];

  intersects.sort((a, b) => a.angle! - b.angle!);

  return intersects;
};

// 绘制多边形（灯光效果）
export const drawPolygon = (
  polygon: Point[],
  ctx: CanvasRenderingContext2D,
  radius: number = 0,
  x: number = 0,
  y: number = 0
) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)"); // 中心更亮
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)"); // 渐变到稍暗
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)"); // 再次渐变
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // 边缘完全透明

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    const intersect = polygon[i];
    ctx.lineTo(intersect.x, intersect.y);
  }
  ctx.fill();
};

// 绘制视点
export function drawViewpoints(
  lightCtx: CanvasRenderingContext2D,
  polygons: Point[][],
  type: "circular" | "sector",
  options: {
    x?: number;
    y?: number;
    radius?: number;
    angle?: number;
    direction?: number;
  }
) {
  if (!polygons || polygons.length === 0 || polygons[0].length === 0) {
    return;
  }
  const {
    x = 0,
    y = 0,
    radius = 100,
    angle = Math.PI * 2,
    direction = 0,
  } = options;
  lightCtx.save();
  lightCtx.beginPath();
  lightCtx.globalCompositeOperation = "destination-out";

  if (type === "circular") {
    lightCtx.arc(x, y, radius, 0, Math.PI * 2, false);
  } else if (type === "sector") {
    lightCtx.moveTo(x, y);
    lightCtx.arc(x, y, radius, direction - angle / 2, direction + angle / 2);
    lightCtx.lineTo(x, y);
  }

  lightCtx.clip();

  for (var i = 0; i < polygons.length; i++) {
    drawPolygon(polygons[i], lightCtx, radius, x, y);
  }
  lightCtx.globalCompositeOperation = "source-over";
  lightCtx.restore();
}

// 绘制攻击视线
export function drawAttachedViewpoints(
  lightCtx: CanvasRenderingContext2D,
  polygon: Point[],
  x: number,
  y: number,
  radius: number,
  angle: number,
  direction: number
) {
  lightCtx.save();
  lightCtx.beginPath();

  lightCtx.moveTo(x, y);
  lightCtx.arc(x, y, radius, direction - angle / 2, direction + angle / 2);
  lightCtx.lineTo(x, y);

  lightCtx.clip();

  lightCtx.fillStyle = "rgba(209, 10, 10, 0.2)";
  lightCtx.beginPath();
  lightCtx.moveTo(polygon[0].x, polygon[0].y);
  for (let j = 0; j < polygon.length; j++) {
    const intersect = polygon[j];
    lightCtx.lineTo(intersect.x, intersect.y);
  }
  lightCtx.fill();

  lightCtx.restore();
}

// 绘制角色视线集合 （公用一个光源体）
export function drawCharacterViewpoints(
  lightCtx: CanvasRenderingContext2D,
  geometryList: Geometry[],
  x: number,
  y: number,
  visibleRadius: number,
  visibleAngle: number,
  attackRadius: number,
  attackAngle: number,
  direction: number
) {
    // const fileList = filterSegments(
    //   geometryList,
    //   {
    //     x: x,
    //     y: y,
    //   },
    //   visibleRadius * 2
    // );
  const fileList = geometryList;

  const fuzzyRadius = 5;
  const polygons = [getSightPolygon(fileList, x, y)];
  for (var angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2)) {
    const dx = Math.cos(angle) * fuzzyRadius;
    const dy = Math.sin(angle) * fuzzyRadius;
    polygons.push(getSightPolygon(fileList, x + dx, y + dy));
  }

  // 绘制圆形视图
  drawViewpoints(lightCtx, polygons, "circular", {
    x: x,
    y: y,
    radius: visibleRadius / 5,
  });

  // 绘制扇形视图
  drawViewpoints(lightCtx, polygons, "sector", {
    x: x,
    y: y,
    radius: visibleRadius,
    angle: visibleAngle,
    direction: direction,
  });

  // 绘制攻击视图
  drawAttachedViewpoints(
    lightCtx,
    polygons[0],
    x,
    y,
    attackRadius,
    attackAngle / 3,
    direction
  );
}

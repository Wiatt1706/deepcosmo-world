import { Point, Ray, Segment } from "@/types/CanvasTypes";

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

export const getSightPolygon = (
  segments: Segment[],
  sightX: number,
  sightY: number
): Point[] => {
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
  const {
    x = 0,
    y = 0,
    radius = 100,
    angle = Math.PI * 2,
    direction = 0,
  } = options;

  lightCtx.save();
  lightCtx.beginPath();

  if (type === "circular") {
    lightCtx.arc(x, y, radius, 0, Math.PI * 2, false);
  } else if (type === "sector") {
    lightCtx.moveTo(x, y);
    lightCtx.arc(x, y, radius, direction - angle / 2, direction + angle / 2);
    lightCtx.lineTo(x, y);
  }

  lightCtx.clip();
  lightCtx.globalCompositeOperation = "destination-out";

  for (var i = 0; i < polygons.length; i++) {
    drawPolygon(polygons[i], lightCtx, radius, x, y);
  }

  lightCtx.globalCompositeOperation = "source-over";
  lightCtx.restore();
}

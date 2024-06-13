import { Geometry, Point, Ray, Segment } from "@/types/CanvasTypes";

export const isColliding = (
  segments: Segment[],
  x: number = 0,
  y: number = 0,
  radius: number = 0
) => {
  for (const segment of segments) {
    const { a, b } = segment;
    const dist = distanceFromPointToSegment({ x, y }, a, b);
    if (dist < radius) {
      return true;
    }
  }
  return false;
};

const distanceFromPointToSegment = (
  point: Point,
  segmentA: Point,
  segmentB: Point
) => {
  const { x: px, y: py } = point;
  const { x: ax, y: ay } = segmentA;
  const { x: bx, y: by } = segmentB;

  const ABx = bx - ax;
  const ABy = by - ay;
  const APx = px - ax;
  const APy = py - ay;

  const AB_dot_AP = ABx * APx + ABy * APy;
  const AB_length_squared = ABx * ABx + ABy * ABy;
  const t = Math.max(0, Math.min(1, AB_dot_AP / AB_length_squared));

  const closestX = ax + t * ABx;
  const closestY = ay + t * ABy;

  const distance = Math.sqrt((closestX - px) ** 2 + (closestY - py) ** 2);
  return distance;
};

export const handleCollision = (
  geometryList: Geometry[],
  radius: number = 0,
  x: number = 0,
  y: number = 0,
  velocityX: number = 0,
  velocityY: number = 0
) => {
  let collided = false;
  const segments = geometryList.flatMap((geom) => geom.segments);

  for (const segment of segments) {
    const { a, b } = segment;
    const dist = distanceFromPointToSegment({ x, y }, a, b);

    if (dist < radius) {
      collided = true;
      const normal = getNormal(a, b);
      const overlap = radius - dist;
      x += normal.x * overlap;
      y += normal.y * overlap;

      const dotProduct = velocityX * normal.x + velocityY * normal.y;
      velocityX -= 2 * dotProduct * normal.x;
      velocityY -= 2 * dotProduct * normal.y;
    }
  }

  return { x, y, velocityX, velocityY, collided };
};

const getNormal = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return { x: dy / length, y: -dx / length };
};

export const resetGeometry = (
  geometryList: Geometry[],
  offsetX: number,
  offsetY: number,
  angle: number
): Geometry[] => {
  const radians = (Math.PI / 180) * angle;

  const rotatePoint = (point: Point, origin: Point, radians: number): Point => {
    const translatedX = point.x - origin.x;
    const translatedY = point.y - origin.y;

    const rotatedX =
      translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    const rotatedY =
      translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

    return {
      x: rotatedX + origin.x,
      y: rotatedY + origin.y,
    };
  };

  const resetSegment = (segment: Segment, origin: Point): Segment => {
    return {
      a: rotatePoint(
        { x: segment.a.x + offsetX, y: segment.a.y + offsetY },
        origin,
        radians
      ),
      b: rotatePoint(
        { x: segment.b.x + offsetX, y: segment.b.y + offsetY },
        origin,
        radians
      ),
    };
  };

  return geometryList.map((geometry) => ({
    ...geometry,
    segments: geometry.segments.map((segment) =>
      resetSegment(segment, { x: offsetX, y: offsetY })
    ),
  }));
};

export const resetGeometryList = (
  geometryList: Geometry[],
  dx: number,
  dy: number,
  angle: number
): Geometry[] => {
  // Convert the angle to radians for trigonometric functions
  const angleRad = angle * (Math.PI / 180);

  // Function to apply inverse transformations to a point
  const resetPoint = (point: Point): Point => {
    // Translate the point
    let translatedX = point.x - dx;
    let translatedY = point.y - dy;

    // Rotate the point back
    let resetX =
      translatedX * Math.cos(-angleRad) - translatedY * Math.sin(-angleRad);
    let resetY =
      translatedX * Math.sin(-angleRad) + translatedY * Math.cos(-angleRad);

    return { x: resetX, y: resetY };
  };

  // Process each geometry in the list
  return geometryList.map((geometry) => ({
    ...geometry,
    segments: geometry.segments.map((segment) => ({
      a: resetPoint(segment.a),
      b: resetPoint(segment.b),
    })),
  }));
};

import { PixelBlock } from "@/types/MapTypes";

const algorithm: any = {};

/**
 * 菱形平方算法实现
 */
algorithm.createDiamondSquareTerrain = function ({
  detail,
  roughness,
}: {
  detail: number;
  roughness: number;
}): Uint8Array {
  roughness = roughness || 6;

  // 初始化网格，并设置默认最大高度
  const size = Math.pow(2, detail || 6) + 1;
  const max = size - 1;
  const maxAlt = 255; // always.
  const grid = new Uint8Array(size * size);

  function get(x: number, y: number): number {
    if (x < 0 || x > max || y < 0 || y > max) return -1;
    return grid[x + size * y];
  }

  function set(x: number, y: number, val: number): void {
    grid[x + size * y] = val;
  }

  // 初始设置正方形四个角落
  set(0, 0, Math.round((Math.random() * maxAlt) / 2));
  set(max, 0, Math.round((Math.random() * maxAlt) / 2));
  set(max, max, Math.round((Math.random() * maxAlt) / 2));
  set(0, max, Math.round((Math.random() * maxAlt) / 2));

  divide(max);
  return grid;

  // 分形递归
  function divide(size: number): void {
    const half = size / 2;
    const scale = roughness * size;

    // 无法续分，终止循环
    if (half < 1) return;

    for (let y = half; y < max; y += size) {
      for (let x = half; x < max; x += size) {
        // 正方形处理
        square(x, y, half, Math.random() * scale * 2 - scale);
      }
    }

    for (let y = 0; y <= max; y += half) {
      for (let x = (y + half) % size; x <= max; x += size) {
        // 菱形处理
        diamond(x, y, half, Math.random() * scale * 2 - scale);
      }
    }

    divide(size / 2);
  }

  function average(values: number[]): number {
    const valid = values.filter((val) => val !== -1);
    const total = valid.reduce((sum, val) => sum + val, 0);
    return total / valid.length;
  }

  // 正方形处理
  function square(x: number, y: number, size: number, offset: number): void {
    const ave = average([
      get(x - size, y - size), // upper left
      get(x + size, y - size), // upper right
      get(x + size, y + size), // lower right
      get(x - size, y + size), // lower left
    ]);
    set(x, y, ave + offset);
  }

  // 菱形处理
  function diamond(x: number, y: number, size: number, offset: number): void {
    const ave = average([
      get(x, y - size), // top
      get(x + size, y), // right
      get(x, y + size), // bottom
      get(x - size, y), // left
    ]);
    set(x, y, ave + offset);
  }
};

enum TerrainType {
  ALL = "all",
  LAND = "land",
  OCEAN = "ocean",
}

/**
 * 渲染地形图
 */
algorithm.TerrainRenderer = ({
  detail,
  roughness,
  pixelSize,
  terrainType = TerrainType.ALL,
  maxPixels,
  exclusionWidth,
  exclusionHeight,
}: {
  detail: number;
  roughness: number;
  pixelSize: number;
  terrainType?: TerrainType;
  maxPixels?: number;
  exclusionWidth?: number;
  exclusionHeight?: number;
}): PixelBlock[] => {
  const terrain = algorithm.createDiamondSquareTerrain({
    detail,
    roughness,
  });

  const size = Math.sqrt(terrain.length);
  const max = size - 1;
  const maxAlt = 255;
  const seaLevel = 140;

  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);

  const exclusionMinX = centerX - Math.floor((exclusionWidth || 0) / 2);
  const exclusionMaxX = centerX + Math.floor((exclusionWidth || 0) / 2);
  const exclusionMinY = centerY - Math.floor((exclusionHeight || 0) / 2);
  const exclusionMaxY = centerY + Math.floor((exclusionHeight || 0) / 2);

  const isInExclusionZone = (x: number, y: number) => {
    return (
      x >= exclusionMinX &&
      x <= exclusionMaxX &&
      y >= exclusionMinY &&
      y <= exclusionMaxY
    );
  };

  const getAltitude = (x: number, y: number): number => {
    if (x < 0 || x > max || y < 0 || y > max) return -1;
    return terrain[x + size * y];
  };

  const createLUT = (
    sea: { [key: number]: number },
    land: { [key: number]: number }
  ): number[] => {
    return Array(maxAlt + 1)
      .fill(0)
      .map((_, alt) => {
        const colours = alt <= seaLevel ? sea : land;
        const adjustedAlt =
          alt <= seaLevel
            ? Math.round((alt / seaLevel) * maxAlt)
            : Math.round(((alt - seaLevel) / (maxAlt - seaLevel)) * maxAlt);

        const alts = Object.keys(colours)
          .map(Number)
          .sort((a, b) => a - b);
        if (colours[adjustedAlt] !== undefined) return colours[adjustedAlt];

        for (let i = 0; i < alts.length - 1; i++) {
          const aPrev = alts[i];
          const aNext = alts[i + 1];
          if (adjustedAlt >= aPrev && adjustedAlt < aNext) {
            const cPrev = colours[aPrev];
            const cNext = colours[aNext];
            return Math.round(
              cPrev +
                (adjustedAlt - aPrev) * ((cNext - cPrev) / (aNext - aPrev))
            );
          }
        }
        return 0; // 默认返回值，避免返回undefined
      });
  };

  const hueLut = createLUT(
    { 0: 225, 200: 225, 240: 220, 255: 200 },
    { 0: 115, 160: 80, 255: 45 }
  );
  const satLut = createLUT(
    { 0: 80, 255: 80 },
    { 0: 50, 80: 50, 200: 0, 255: 0 }
  );
  const luxLut = createLUT(
    { 0: 20, 255: 50 },
    { 0: 45, 180: 45, 225: 90, 255: 99 }
  );

  const getColour = (x: number, y: number) => {
    const alt = getAltitude(x, y);
    return {
      hue: hueLut[alt],
      sat: satLut[alt],
      lux: luxLut[alt],
    };
  };

  let pixelBlocks: PixelBlock[] = [];
  let checked = new Set<string>();

  const addPixelBlock = (x: number, y: number) => {
    const { hue, sat, lux } = getColour(x, y);
    const alt = getAltitude(x, y);

    if (
      (terrainType === TerrainType.OCEAN && alt > seaLevel) ||
      (terrainType === TerrainType.LAND && alt <= seaLevel) ||
      isInExclusionZone(x, y)
    ) {
      return;
    }

    const adjustedX = (x - centerX) * pixelSize;
    const adjustedY = (y - centerY) * pixelSize;
    pixelBlocks.push({
      id: adjustedX + "," + adjustedY,
      type: 0,
      x: adjustedX,
      y: adjustedY,
      width: pixelSize,
      height: pixelSize,
      usedBlocks: 1,
      color: `hsl(${hue}, ${sat}%, ${lux}%)`,
    });

    checked.add(`${x},${y}`);
  };

  const inBounds = (x: number, y: number) => {
    return x >= 0 && x <= max && y >= 0 && y <= max;
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  let radius = 0;
  while (!maxPixels || pixelBlocks.length < maxPixels) {
    let newPixels = false;
    let coords: { dx: number; dy: number }[] = [];

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        coords.push({ dx, dy });
      }
    }

    shuffleArray(coords);

    for (let { dx, dy } of coords) {
      const x = centerX + dx;
      const y = centerY + dy;
      if (inBounds(x, y) && !checked.has(`${x},${y}`)) {
        addPixelBlock(x, y);
        newPixels = true;
        if (maxPixels && pixelBlocks.length >= maxPixels) break;
      }
    }

    if (!newPixels) break;
    radius++;
  }

  return pixelBlocks;
};

export default algorithm;
export { TerrainType };

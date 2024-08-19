import _ from "@/components/utils/helpers";
import { PixelBlock } from "@/types/MapTypes";

export const ImgToPixel = (
  img: HTMLImageElement,
  pixelSize: number
): Promise<PixelBlock[]> => {
  return new Promise((resolve, reject) => {
    let pixelBlocks: PixelBlock[] = [];

    if (!img.complete) {
      img.onload = processImage;
      img.onerror = (error) => reject(error);
    } else {
      processImage();
    }

    function processImage() {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const ctx = source.getContext("2d") as CanvasRenderingContext2D;

      ctx.drawImage(img, 0, 0);

      let pxMap = createPxMap(ctx, width, height, pixelSize);
      const centerX = Math.floor(width / pixelSize / 2);
      const centerY = Math.floor(height / pixelSize / 2);

      pxMap.forEach((px) => {
        const { color, x, y } = px;
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
          // imgSrc: img.src,
          color: color,
        });
      });
      resolve(pixelBlocks);
    }

    function createPxMap(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      pixelSize: number
    ) {
      let pxMap = [];
      for (let i = 0; i < width; i += pixelSize) {
        for (let j = 0; j < height; j += pixelSize) {
          let pixel = ctx.getImageData(i, j, 1, 1).data;
          let alpha = pixel[3] / 255;
          if (alpha === 0) continue; // Skip transparent pixels
          let color = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${alpha})`;
          pxMap.push({ x: i / pixelSize, y: j / pixelSize, color });
        }
      }
      return pxMap;
    }

    function dataFun(ctx: CanvasRenderingContext2D, model: number) {
      let color = [100, 100, 200];
      let imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      switch (model) {
        case 1:
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = color[0];
            imageData.data[i + 1] = color[1];
            imageData.data[i + 2] = color[2];
          }
          break;
        case 2:
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 3] = getGray(
              imageData.data[i],
              imageData.data[i + 1],
              imageData.data[i + 2]
            );
            imageData.data[i] = color[0];
            imageData.data[i + 1] = color[1];
            imageData.data[i + 2] = color[2];
          }
          break;
        case 3:
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 3] = getGray2(
              imageData.data[i],
              imageData.data[i + 1],
              imageData.data[i + 2]
            );
            imageData.data[i] = color[0];
            imageData.data[i + 1] = color[1];
            imageData.data[i + 2] = color[2];
          }
          break;
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
  });
};

// 灰度转换
function getGray(R: number, G: number, B: number): number {
  return 256 - (R * 299 + G * 587 + B * 114 + 500) / 1000;
}

// 灰度转换
function getGray2(R: number, G: number, B: number): number {
  return (R * 299 + G * 587 + B * 114 + 500) / 1000;
}

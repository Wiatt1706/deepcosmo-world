import { useState, useEffect, useRef } from "react";

const useScale = (
  initialScale = 1, // 初始 scale 设置为整数
  minScale = 1, // 最小缩放保持为整数
  maxScale = 10, // 最大缩放保持为整数
  step = 1, // 缩放步进也保持为整数
  target?: HTMLDivElement | null
) => {
  const [scale, setScale] = useState(initialScale); // 确保 scale 为整数
  const requestRef = useRef<number | null>(null); // 用于节流

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (requestRef.current !== null) return; // 节流防止多次触发

      requestRef.current = requestAnimationFrame(() => {
        setScale((prevScale) => {
          // 根据滚轮方向，调整 scale，并确保结果为整数
          let newScale = prevScale - Math.sign(event.deltaY) * step;

          // 保证 newScale 在最小和最大值之间，并保持为整数
          newScale = Math.min(Math.max(newScale, minScale), maxScale);

          return newScale;
        });

        requestRef.current = null; // 重置 requestRef
      });
    };

    const eventTarget = target || window;
    eventTarget.addEventListener("wheel", handleWheel as EventListener);

    return () => {
      eventTarget.removeEventListener("wheel", handleWheel as EventListener);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [minScale, maxScale, step, target]);

  return { scale, setScale };
};

export default useScale;

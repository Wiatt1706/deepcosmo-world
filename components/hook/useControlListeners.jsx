import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { controlStatusAtom } from "@/components/SocketManager";

export const useEventListener = (eventType, callback, element) => {
  const handler = useCallback(callback, []);

  useEffect(() => {
    let targetElement = element ? element.current || element : window;

    if (!targetElement.addEventListener) {
      targetElement = document;
    }
    console.log("targetElement");
    targetElement.addEventListener(eventType, handler);

    return () => {
      targetElement.removeEventListener(eventType, handler);
    };
  }, [eventType, handler, element]);
};

export const useControlListeners = () => {
  const elementRef = useRef();

  const [controlStatus, setControlStatus] = useAtom(controlStatusAtom);

  const handleKeyDown = (event) => {
    if (event.code === "Space") {
      setControlStatus((prev) => ({ ...prev, isSpaceDown: true }));
    }
    // 可以根据需要添加其他按键的处理逻辑
  };

  const handleKeyUp = (event) => {
    if (event.code === "Space") {
      setControlStatus((prev) => ({ ...prev, isSpaceDown: false }));
    }
    // 可以根据需要添加其他按键的处理逻辑
  };

  const handleMouseDown = () => {
    setControlStatus((prev) => ({ ...prev, isMouseDown: true }));
  };

  const handleMouseUp = () => {
    setControlStatus((prev) => ({ ...prev, isMouseDown: false }));
  };

  useEventListener("keydown", handleKeyDown);
  useEventListener("keyup", handleKeyUp);
  useEventListener("mousedown", handleMouseDown, elementRef);
  useEventListener("mouseup", handleMouseUp, elementRef);

  return { elementRef, controlStatus };
};

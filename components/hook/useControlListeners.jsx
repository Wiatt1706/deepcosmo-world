import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import {
  controlStatusAtom,
  useTemporalStore,
} from "@/components/SocketManager";

export const useEventListener = (eventType, callback, element) => {
  const handler = useCallback(callback, []);

  useEffect(() => {
    let targetElement = element ? element.current || element : window;

    if (!targetElement.addEventListener) {
      targetElement = document;
    }
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
      // Space
      setControlStatus((prev) => ({ ...prev, isSpaceDown: true }));
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === "Space") {
      setControlStatus((prev) => ({ ...prev, isSpaceDown: false }));
    }
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

"use client";
import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
export default function GridBox() {
  // We turn this into a spring animation that interpolates between 0 and 1

  const controls = useRef();
  const [isMove, setIsMove] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        setIsMove(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        setIsMove(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <gridHelper args={[200, 200, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />

      <OrbitControls
        ref={controls}
        enableDamping
        enableRotate={false}
        enableZoom={true}
        enablePan={isMove}
        dampingFactor={1}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
      />
    </>
  );
}

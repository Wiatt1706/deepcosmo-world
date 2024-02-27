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
      <Grid />
      <OrbitControls
        ref={controls}
        enableDamping
        enableRotate={false}
        enableZoom={true}
        enablePan={isMove}
        dampingFactor={0.25}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
      />
    </>
  );
}

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group
          key={x + ":" + y}
          position={[
            x * 2 - Math.floor(number / 2) * 2,
            -0.01,
            y * 2 - Math.floor(number / 2) * 2,
          ]}
        >
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 100, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />
  </Instances>
);

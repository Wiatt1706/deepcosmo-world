"use client";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useAtom } from "jotai";
import { controlStatusAtom, mouseStageAtom } from "@/components/SocketManager";
import * as THREE from "three";
export default function GridBox() {
  // We turn this into a spring animation that interpolates between 0 and 1
  const controls = useRef();
  const [mouseStage, setMouseStage] = useAtom(mouseStageAtom);
  const [{ isDragging }] = useAtom(controlStatusAtom);
  return (
    <>
      <axesHelper args={[25]} color="#ff0000" />
      <gridHelper args={[50, 50, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />
      <OrbitControls
        ref={controls}
        enableDamping
        enableRotate={false}
        enableZoom={true}
        enablePan={mouseStage == 1 && !isDragging}
        dampingFactor={1}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
      />
    </>
  );
}

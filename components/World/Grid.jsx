"use client";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useAtom } from "jotai";
import { isEnablePanAtom } from "@/components/comment-editor/tool";

export default function GridBox() {
  // We turn this into a spring animation that interpolates between 0 and 1
  const controls = useRef();
  const [isEnablePan] = useAtom(isEnablePanAtom);

  return (
    <>
      <gridHelper args={[200, 200, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />

      <OrbitControls
        ref={controls}
        enableDamping
        enableRotate={false}
        enableZoom={true}
        enablePan={isEnablePan}
        dampingFactor={1}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
      />
    </>
  );
}

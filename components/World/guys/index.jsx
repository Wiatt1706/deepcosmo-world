"use client";
import styles from "@/styles/world/index.module.css";
import { Cloud, Clouds, KeyboardControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useMemo } from "react";
import { Experience } from "./Experience";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Lights from "@/components/World/environment/Lights";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

export default function Guys({ info }) {
  // 绑定操作控制器

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <div className={styles["editor"]}>
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 16, 10], fov: 42 }}>
          <Sky sunPosition={[100, 20, 100]} />

          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud seed={10} bounds={20} volume={30} position={[0, 50, 0]} />
          </Clouds>
          <Lights />
          <Physics>
            <Experience />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

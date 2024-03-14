"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import GridBox from "../element/Grid";
import { useControlListeners } from "../../hook/useControlListeners";
import { ListModels } from "@/components/World/land/ListModels";
import { Environment } from "@react-three/drei";
import { useEffect, useState } from "react";
import Controls from "@/components/World/land/Controls";
import { useElementStore } from "@/components/SocketManager";

export default function LandWorld({ info }) {
  // 绑定操作控制器
  const { elementRef } = useControlListeners();

  const setModelList = useElementStore((state) => state.setModelList);

  useEffect(() => {
    setModelList(info.models);
  }, [info.models]);

  return (
    <div className={styles["editor"]}>
      <Canvas
        ref={elementRef}
        shadows
        camera={{ position: [0, 10, 15], fov: 60 }}
        // orthographic
        // camera={{ position: [0, 50, 0], zoom: 50 }}
      >
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#b9b9b9"
          position={[-7, 25, 13]}
          intensity={0.85}
        />
        <Environment preset="city" />

        <GridBox size={info?.size} />

        <ListModels />

        <Controls />
      </Canvas>
    </div>
  );
}

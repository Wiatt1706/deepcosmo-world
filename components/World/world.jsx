"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import { HtmlTooltip } from "@/components/World/html";
import { ContentEditor } from "../comment-editor";
import { ContentEditor3 } from "../comment-editor/index copy";
import GridBox from "../World/Grid";
import { useControlListeners } from "../hook/useControlListeners";
import * as THREE from "three";
import { useRef } from "react";

import { ListModels } from "@/components/World/ListModels";
import { ContactShadows, Environment } from "@react-three/drei";

export default function World() {
  const domContent = useRef();
  // 绑定操作控制器
  const { elementRef } = useControlListeners();
  return (
    <div className={styles["editor"]}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        ref={domContent}
      />

      <Canvas
        ref={elementRef}
        shadows
        orthographic
        camera={{ position: [0, 50, 0], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#fff"]} />
        <ambientLight intensity={1} color={"#ffffff"} />
        <Environment preset="sunset" />
        <ContactShadows scale={50} blur={3} far={20} />
        
        <GridBox />
        <ListModels />
      </Canvas>
    </div>
  );
}

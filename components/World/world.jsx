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
        orthographic
        camera={{ position: [0, 20, 0], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f5"]} />

        <GridBox />
        <HtmlTooltip
          portal={domContent}
          position={[0, 0.5, 0]}
          title="Hello World!"
        >
          <ContentEditor3 text="Hello World!" />
        </HtmlTooltip>

        <HtmlTooltip
          portal={domContent}
          position={[10, 0.5, 0]}
          title="Hello World!"
        >
          <ContentEditor text="Hello World!" />
        </HtmlTooltip>

        <HtmlTooltip
          portal={domContent}
          position={[-10, 0.5, 0]}
          title="Hello World!"
        >
          <ContentEditor text="Hello World!" />
        </HtmlTooltip>
      </Canvas>
    </div>
  );
}

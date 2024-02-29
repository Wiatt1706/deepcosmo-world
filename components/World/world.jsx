"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import { HtmlTooltip } from "@/components/World/html";
import { ContentEditor } from "../comment-editor";
import { ContentEditor3 } from "../comment-editor/index copy";
import GridBox from "../World/Grid";
import { useControlListeners } from "../hook/useControlListeners";

export default function World() {
  
  // 绑定操作控制器
  const { elementRef } = useControlListeners();
  
  return (
    <div className={styles["editor"]}>
      <Canvas
        ref={elementRef}
        orthographic
        camera={{ position: [0, 10, 0], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f5"]} />
        <fog attach="fog" args={["#fff", 10, 60]} />

        <GridBox />
        <HtmlTooltip position={[0, 0.5, 0]} title="Hello World!">
          <ContentEditor3 text="Hello World!" />
        </HtmlTooltip>

        <HtmlTooltip position={[10, 0.5, 0]} title="Hello World!">
          <ContentEditor text="Hello World!" />
        </HtmlTooltip>

        <HtmlTooltip position={[-10, 0.5, 0]} title="Hello World!">
          <ContentEditor text="Hello World!" />
        </HtmlTooltip>
      </Canvas>
    </div>
  );
}

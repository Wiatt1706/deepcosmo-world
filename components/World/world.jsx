"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { HtmlTooltip } from "@/components/World/html";
import { ContentEditor } from "../comment-editor";
import GridBox from "../World/Grid";
export default function World() {
  return (
    <div className={styles["editor"]}>
      <Canvas
        shadows
        orthographic
        camera={{ position: [0, 10, 0], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f5"]} />
        <fog attach="fog" args={["#fff", 10, 60]} />

        <GridBox />
        <HtmlTooltip rotation-x={-Math.PI / 2} title="Hello World!">
          <ContentEditor />
        </HtmlTooltip>
      </Canvas>
    </div>
  );
}

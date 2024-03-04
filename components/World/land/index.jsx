"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import GridBox from "../Grid";
import { useControlListeners } from "../../hook/useControlListeners";
import { useRef } from "react";
import { ListModels } from "@/components/World/land/ListModels";
import { ContactShadows, Environment } from "@react-three/drei";
import { listModelsAtom } from "@/components/SocketManager";
import { useAtom } from "jotai";

export default function LandWorld({ id, models }) {
  const [listModels, setListModels] = useAtom(listModelsAtom);
  setListModels(models);
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

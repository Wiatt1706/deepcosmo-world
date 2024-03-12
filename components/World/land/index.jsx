"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import GridBox from "../element/Grid";
import { useControlListeners } from "../../hook/useControlListeners";
import { ListModels } from "@/components/World/land/ListModels";
import {
  ContactShadows,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { listModelsAtom, useStore } from "@/components/SocketManager";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function LandWorld({ info }) {
  // 绑定操作控制器
  const { elementRef } = useControlListeners();

  const { target, setTarget } = useStore();
  const [listModels, setListModels] = useAtom(listModelsAtom);

  setListModels(info.models);

  const handleTransformEnd = () => {
    // 获取被 TransformControls 控制的对象的信息
    setListModels((prevList) => {
      const updatedList = prevList.map((model) =>
        model.id === target.id
          ? {
              ...model,
              position: target.object.position,
              rotation: target.object.rotation,
              scale: target.object.scale,
            }
          : model
      );
      console.log("Updated List:", updatedList);
      return updatedList;
    });
  };

  return (
    <div className={styles["editor"]}>
      <Canvas
        onPointerMissed={() => {
          setTarget(null);
          handleTransformEnd;
        }}
        ref={elementRef}
        shadows
        // orthographic
        // camera={{ position: [0, 50, 0], zoom: 50 }}
        camera={{ position: [0, 5, 5], fov: 75 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f2"]} />
        <ambientLight intensity={1} color={"#ffffff"} />
        <Environment preset="sunset" />
        {target && (
          <TransformControls
            onMouseUp={() => handleTransformEnd()}
            object={target.object}
            // showY={false}
            mode={"translate"}
          />
        )}
        <GridBox size={info.size} />
        <ListModels />
      </Canvas>
    </div>
  );
}

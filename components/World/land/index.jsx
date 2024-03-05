"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import GridBox from "../Grid";
import { useControlListeners } from "../../hook/useControlListeners";
import { ListModels } from "@/components/World/land/ListModels";
import {
  ContactShadows,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { listModelsAtom, useStore } from "@/components/SocketManager";
import { useAtom } from "jotai";

export default function LandWorld({ info }) {
  // 绑定操作控制器
  const { elementRef } = useControlListeners();

  const { target, setTarget } = useStore();
  const [listModels, setListModels] = useAtom(listModelsAtom);
  setListModels(info.models);

  const handleTransformEnd = (event) => {
    // 获取被 TransformControls 控制的对象的信息
    console.log(target.object.position.x);
    target.onUpdate({
      position: target.object.position,
    });
  };

  return (
    <div className={styles["editor"]}>
      <Canvas
        onPointerMissed={() => setTarget(null)}
        ref={elementRef}
        shadows
        orthographic
        camera={{ position: [0, 50, 0], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#fff"]} />
        <ambientLight intensity={1} color={"#ffffff"} />
        <Environment preset="sunset" />
        {target && (
          <>
            <TransformControls
              onMouseUp={(event) => handleTransformEnd(event)}
              object={target.object}
              showY={false}
              mode={"translate"}
            />

          </>
        )}
        <GridBox size={info.size} />
        <ListModels />
      </Canvas>
    </div>
  );
}

"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import GridBox from "../element/Grid";
import { useControlListeners } from "../../hook/useControlListeners";
import { ListModels } from "@/components/World/land/ListModels";
import {
  Cloud,
  Clouds,
  Environment,
  Html,
  Sky,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import Controls from "@/components/World/land/Controls";
import { useMyStore } from "@/components/SocketManager";
import KeyListener from "@/components/World/land/KeyHandler";
import LoadScene from "@/components/World/land/LoadScene";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
export default function LandWorld({ info }) {
  // 绑定操作控制器
  const { elementRef } = useControlListeners();

  const [systemInfo, setModelList] = useMyStore((state) => [
    state.systemInfo,
    state.setModelList,
  ]);

  useEffect(() => {
    setModelList(info.models, false);
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
        <KeyListener />
        <pointLight position={[100, 100, 100]} intensity={0.8} />
       
        <color attach="background" args={[systemInfo.sceneColor]} />
        <Environment preset={systemInfo.sceneEvn} background blur={0.78} />

        {systemInfo.openGrid && <GridBox size={info?.size} />}
        {systemInfo.openSky && <Sky sunPosition={[100, 20, 100]} />}

        <Suspense fallback={<Loader />}>
          <Physics debug={true} paused={systemInfo.openSky} colliders={false}>
            <ListModels landId={info?.id} />
          </Physics>

          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud seed={10} bounds={20} volume={30} position={[0, 50, 0]} />
          </Clouds>
          {info?.model_url && <LoadScene model_url={info?.model_url} />}
        </Suspense>

        <Controls />
      </Canvas>
    </div>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

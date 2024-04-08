"use client";
import styles from "@/styles/world/index.module.css";
import { Canvas } from "@react-three/fiber";
import { useControlListeners } from "../../hook/useControlListeners";
import { ListModels } from "@/components/World/land/ListModels";
import {
  Cloud,
  Clouds,
  Html,
  Sky,
  SoftShadows,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { useMyStore } from "@/components/SocketManager";
import LoadScene from "@/components/World/land/LoadScene";
import Ground from "@/components/World/element/Ground";
import Lights from "@/components/World/environment/Lights";
import Player from "@/components/World/element/Player";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
export default function PlayWorld({ info }) {
  const [systemInfo, setModelList] = useMyStore((state) => [
    state.systemInfo,
    state.setModelList,
  ]);

  useEffect(() => {
    setModelList(info.models, false);
  }, [info.models]);

  const { enabled, ...config } = {
    enabled: true,
    size: { value: 6, min: 0, max: 100 },
    focus: { value: 0, min: 0, max: 2 },
    samples: { value: 10, min: 1, max: 20, step: 1 },
  };

  return (
    <div className={styles["editor"]}>
      <Canvas
        shadows
        camera={{ position: [0, 3, 2], far: 50, fov: 75, near: 0.1 }}
      >
        <ambientLight intensity={1} color={"#ffffff"} />
        <Lights />
        <color attach="background" args={[systemInfo.sceneColor]} />
        <fog attach="fog" args={["#fff", 10, 60]} />
        {enabled && <SoftShadows {...config} />}
        {/* <Environment preset={systemInfo.sceneEvn} background blur={0.78} /> */}
        {info?.model_url && <LoadScene model_url={info?.model_url} />}
        {info?.system_data?.openSky && <Sky sunPosition={[100, 100, 100]} />}
        <Suspense fallback={<Loader />}>
          <Physics colliders={false}>
            <Ground />
            <Player />
            <ListModels landId={info?.id} />
          </Physics>

          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud seed={10} bounds={20} volume={30} position={[0, 40, 0]} />
          </Clouds>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

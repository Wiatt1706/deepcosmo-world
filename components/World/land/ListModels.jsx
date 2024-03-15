"use client";
import { Suspense, useDeferredValue, useEffect, useState } from "react";
import { useElementStore } from "@/components/SocketManager";
import { useGLTF, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import DynamicGeometry from "@/components/World/element/DynamicGeometry";
import MeshComponent from "@/components/World/element/MeshComponent";

export function ListModels() {
  const { scene } = useThree(); // This will just crash
  const [setSceneList, modelList] = useElementStore((state) => [
    state.setSceneList,
    state.modelList,
  ]);

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  return (
    <Suspense fallback={<LoadingMessage />}>
      {modelList?.map((modelData) =>
        modelData.model_url ? (
          <Model key={modelData.id} data={modelData} />
        ) : (
          <DynamicGeometry key={modelData.id} data={modelData} />
        )
      )}
    </Suspense>
  );
}

function LoadingMessage() {
  return (
    <Text fontSize={1}>
      Loading...
      <meshStandardMaterial color="#aaa" toneMapped={false} />
    </Text>
  );
}

function Model({ data }) {
  const deferred = useDeferredValue(data.model_url);
  const { scene } = useGLTF(deferred);

  return (
    <MeshComponent
      id={data.id}
      name={data.text}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
      isSelect={data.isSelect}
    >
      <primitive object={scene} />
    </MeshComponent>
  );
}

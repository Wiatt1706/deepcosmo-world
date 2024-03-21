"use client";
import { Suspense, useDeferredValue, useEffect, useRef, useState } from "react";
import { useElementStore, useExportStore } from "@/components/SocketManager";
import { useGLTF, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import DynamicGeometry from "@/components/World/element/DynamicGeometry";
import MeshComponent from "@/components/World/element/MeshComponent";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
export function ListModels() {
  const modelsRef = useRef();
  const scene = useThree((state) => state.scene);
  const [setSceneList, modelList] = useElementStore((state) => [
    state.setSceneList,
    state.modelList,
  ]);
  const exporter = new GLTFExporter();
  const { target, setTarget } = useExportStore();
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  useEffect(() => {
    setSceneList(scene.children);
  }, [modelList]);

  useEffect(() => {
    if (target) {
      exporter.parse(target, (result) => {
        saveString(JSON.stringify(result), "object.gltf");
        setTarget(null);
      });
    }
  }, [target]);

  function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  function saveString(text, filename) {
    save(new Blob([text], { type: "application/octet-stream" }), filename);
  }

  return (
    <Suspense fallback={<LoadingMessage />}>
      <group ref={modelsRef}>
        {modelList?.map((modelData) =>
          modelData.model_url ? (
            <Model key={modelData.id} data={modelData} />
          ) : (
            <DynamicGeometry key={modelData.id} data={modelData} />
          )
        )}
      </group>
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

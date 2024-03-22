"use client";
import {
  Suspense,
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useElementStore, useExportStore } from "@/components/SocketManager";
import { useGLTF, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import DynamicGeometry from "@/components/World/element/DynamicGeometry";
import MeshComponent from "@/components/World/element/MeshComponent";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { saveString } from "@/components/utils/DownUrl";
export function ListModels() {
  const modelsRef = useRef();
  const scene = useThree((state) => state.scene);
  const [setSceneList, modelList] = useElementStore((state) => [
    state.setSceneList,
    state.modelList,
  ]);
  const exporter = new GLTFExporter();
  const { target, setTarget } = useExportStore();

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

  const modelComponents = useMemo(() => {
    return modelList?.map((modelData) =>
      modelData.model_url ? (
        <Model key={modelData.id} data={modelData} />
      ) : (
        <DynamicGeometry key={modelData.id} data={modelData} />
      )
    );
  }, [modelList]);

  return (
    <Suspense fallback={<LoadingMessage />}>
      <group ref={modelsRef}>{modelComponents}</group>
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

const Model = memo(({ data }) => {
  const deferred = useDeferredValue(data.model_url);
  const { scene } = useGLTF(deferred);

  return (
    <MeshComponent
      id={data.id}
      type={data.type}
      name={data.text}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
      isSelect={data.isSelect}
    >
      <primitive object={scene} />
    </MeshComponent>
  );
});

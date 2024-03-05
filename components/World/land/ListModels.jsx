"use client";
import { Suspense, useDeferredValue, useState } from "react";
import { useAtom } from "jotai";
import { useStore, listModelsAtom } from "@/components/SocketManager";
import { useGLTF, Text, useCursor } from "@react-three/drei";

export function ListModels({ ...props }) {
  const [listModels, setListModels] = useAtom(listModelsAtom);

  const updateModelData = (modelId, newData) => {
    console.log("updateModelData", modelId, newData);
    // 根据模型的 ID 更新模型数据
    setListModels((prevList) =>
      prevList.map((model) =>
        model.id === modelId ? { ...model, ...newData } : model
      )
    );
  };

  return (
    <Suspense fallback={<LoadingMessage />}>
      <group {...props}>
        {listModels?.map((modelData) => (
          <Model
            key={modelData.id}
            onUpdate={(newData) => updateModelData(modelData.id, newData)}
            url={modelData.model_url}
            scale={modelData.scale}
            position={modelData.position}
            rotation={modelData.rotation}
          />
        ))}
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

function Model({ url, onUpdate, ...props }) {
  const deferred = useDeferredValue(url);
  const { scene } = useGLTF(deferred);

  const setTarget = useStore((state) => state.setTarget);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh
      {...props}
      position={props.position}
      onClick={(e) => setTarget({ object: e.object, onUpdate: onUpdate })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </mesh>
  );
}

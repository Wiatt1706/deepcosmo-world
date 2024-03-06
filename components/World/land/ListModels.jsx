"use client";
import { Suspense, useDeferredValue, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useStore, listModelsAtom } from "@/components/SocketManager";
import { useGLTF, Text, useCursor } from "@react-three/drei";

export function ListModels({ ...props }) {
  const [listModels] = useAtom(listModelsAtom);

  return (
    <Suspense fallback={<LoadingMessage />}>
      <group {...props}>
        {listModels?.map((modelData) => (
          <Model
            key={modelData.id}
            id={modelData.id}
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

function Model({ url, id, ...props }) {
  const deferred = useDeferredValue(url);
  const { scene } = useGLTF(deferred);

  const setTarget = useStore((state) => state.setTarget);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh
      {...props}
      onClick={(e) => setTarget({ object: e.object, id })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </mesh>
  );
}

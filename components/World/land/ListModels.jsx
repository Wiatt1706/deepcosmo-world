"use client";
import { Suspense, useDeferredValue, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { listModelsAtom } from "@/components/SocketManager";
import { useGLTF, Text } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { controlStatusAtom } from "@/components/SocketManager";
import { animated, useSpring } from "@react-spring/three";

export function ListModels() {
  const [listModels, setListModels] = useAtom(listModelsAtom);

  return (
    <group>
      {listModels?.map((modelData) => (
        <Suspense fallback={<LoadingMessage />}>
          <Model
            key={modelData.id}
            position={modelData.position}
            rotation={modelData.rotation}
            scale={modelData.scale}
            url={modelData.model_url}
          />
        </Suspense>
      ))}
    </group>
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

function Model({ url, ...props }) {
  const [controlStatus, setControlStatus] = useAtom(controlStatusAtom);

  const [pos, setPos] = useState(props.position);
  const deferred = useDeferredValue(url);
  const { scene } = useGLTF(deferred);
  let planeIntersectPoint = new THREE.Vector3();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  const [spring, api] = useSpring(() => ({
    position: pos,
    scale: 1,
    config: { friction: 10 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      if (active) {
        event.ray.intersectPlane(floorPlane, planeIntersectPoint);
        setPos([planeIntersectPoint.x, 0.01, planeIntersectPoint.z]);
      }

      api.start({
        position: pos,
        scale: active ? 1.2 : 1,
      });
      setControlStatus((prev) => ({ ...prev, isDragging: active }));

      return timeStamp;
    },
    {
      delay: true,
    }
  );

  // <primitive object={...} mounts an already existing object
  return (
    <animated.mesh {...spring} position={pos} {...bind()} castShadow>
      <primitive object={scene} />
    </animated.mesh>
  );
}

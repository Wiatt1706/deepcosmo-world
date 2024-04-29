import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef, useState } from "react";
import { Color } from "three";
import { MathUtils, randFloat } from "three/src/math/MathUtils.js";

export const Hexagon = React.memo(({ color, onHit, hit, ...props }) => {
  const { nodes, materials } = useGLTF("/models/hexagon.glb", "draco/gltf/");
  const hexagonMaterial = useRef();

  const [disabled, setDisabled] = useState(false);
  const randomizedColor = useMemo(() => {
    const alteredColor = new Color(color);
    alteredColor.multiplyScalar(randFloat(0.5, 1.2));
    return alteredColor;
  }, [color]);

  useFrame((_, delta) => {
    if (hit && !disabled) {
      hexagonMaterial.current.opacity = MathUtils.lerp(
        hexagonMaterial.current.opacity,
        0,
        delta * 1.2
      );
    }
  });

  const handleCollision = (e) => {
    if (e.other.rigidBodyObject.name === "player") {
      onHit();
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <RigidBody
      {...props}
      type={"fixed"}
      name="hexagon"
      colliders="hull"
      onCollisionEnter={handleCollision}
    >
      <mesh geometry={nodes.Hexagon.geometry} material={materials.hexagon}>
        <meshStandardMaterial
          ref={hexagonMaterial}
          color={hit ? "orange" : randomizedColor}
          transparent
        />
      </mesh>
    </RigidBody>
  );
});

useGLTF.preload("/models/hexagon.glb", "draco/gltf/");

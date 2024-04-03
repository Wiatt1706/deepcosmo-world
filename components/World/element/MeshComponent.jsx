import React, { useEffect, useRef, useState } from "react";
import { useElementStore } from "@/components/SocketManager";
import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

function MeshComponent({
  id,
  model,
  children,
  isRigid = false,
  isSelect = false,
  ...props
}) {
  const ref = useRef();
  const setTarget = useElementStore((state) => state.setTarget);
  const [hovered, setHovered] = useState(false);
  const camera = useThree((state) => state.camera);

  useCursor(hovered);

  const handleClick = (e) => {
    e.stopPropagation();
    setTarget({ object: e.object, id });
  };

  const handlePointerMissed = (e) => {
    if (e.type === "click") {
      setTarget(null);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  useEffect(() => {
    if (isSelect && ref.current) {
      setTarget({ object: ref.current, id });
      const { x, y, z } = ref.current.position;
      camera.position.set(x, y + 10, z + 10); // 这里的 +5 是一个示例，你可以根据需要进行调整
      camera.lookAt(x, y, z); // 相机朝向目标Mesh
    }
  }, [isSelect]);

  return (
    <>
      {isRigid ? (
        <RigidBody colliders="trimesh" restitution={0.7} type="fixed">
          <mesh
            {...props}
            ref={ref}
            userData={{ primaryId: id }}
            onClick={handleClick}
            onPointerMissed={handlePointerMissed}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {children}
          </mesh>
        </RigidBody>
      ) : (
        <mesh
          {...props}
          ref={ref}
          userData={{ primaryId: id }}
          onClick={handleClick}
          onPointerMissed={handlePointerMissed}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {children}
        </mesh>
      )}
    </>
  );
}

export default MeshComponent;

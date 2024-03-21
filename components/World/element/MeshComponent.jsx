import React, { useEffect, useRef, useState } from "react";
import { useStore, useExportStore } from "@/components/SocketManager";
import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

function MeshComponent({ id, children, isSelect = false, ...props }) {
  const ref = useRef();
  const setTarget = useStore((state) => state.setTarget);
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
  );
}

export default MeshComponent;

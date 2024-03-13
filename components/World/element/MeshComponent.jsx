import React, { useState } from "react";
import { useStore } from "@/components/SocketManager";
import { useCursor } from "@react-three/drei";

function MeshComponent({ id, children, ...props }) {
  const setTarget = useStore((state) => state.setTarget);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handleClick = (e) => {
    setTarget({ object: e.object, id });
  };

  const handlePointerMissed = (e) => {
    if (e.type === "click") {
      setTarget(null);
    }
  };

  const handlePointerOver = () => {
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return (
    <mesh
      {...props}
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

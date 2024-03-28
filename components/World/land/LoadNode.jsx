import React, { memo } from "react";
import { useGLTF } from "@react-three/drei";
import { useElementStore } from "@/components/SocketManager";

const LoadNode = memo(({ model_url }) => {
  const setNodes = useElementStore((state) => state.setNodes);

  if (!model_url) {
    return null;
  }

  const { nodes } = useGLTF(model_url);
  setNodes(nodes);

  return null;
});

export default LoadNode;

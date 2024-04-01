import { useGLTF } from "@react-three/drei";
import { useElementStore } from "@/components/SocketManager";
import { useEffect } from "react";

const LoadScene = ({ model_url }) => {
  const setNodes = useElementStore((state) => state.setNodes);
  const { nodes } = useGLTF(model_url);

  useEffect(() => {
    setNodes(nodes);
  }, [model_url]);

  return null;
};
export default LoadScene;

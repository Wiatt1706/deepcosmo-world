import React, { useDeferredValue, memo } from "react";
import MeshComponent from "@/components/World/element/MeshComponent";
import { useGLTF } from "@react-three/drei";

const ImportGeometry = memo(({ data }) => {
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

export default ImportGeometry;

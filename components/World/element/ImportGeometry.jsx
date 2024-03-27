import React, { useDeferredValue, memo } from "react";
import MeshComponent from "@/components/World/element/MeshComponent";
import { useGLTF } from "@react-three/drei";

const importGeometryRecursively = (object, index) => {
  if (object.type === "Mesh") {
    return (
      <MeshComponent
        key={index}
        id={object.id}
        type={object.type}
        name={object.name}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        geometry={object.geometry}
        material={object.material}
        dispose={null}
      />
    );
  } else if (object.type === "Group" || object.type === "Object3D") {
    return (
      <group key={index}>
        {object.children.map((child, i) => importGeometryRecursively(child, i))}
      </group>
    );
  } else {
    return <primitive key={index} object={object.clone()} />;
  }
};

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
      {scene.children.map((child, index) =>
        importGeometryRecursively(child, index)
      )}
    </MeshComponent>
  );
});

export default ImportGeometry;

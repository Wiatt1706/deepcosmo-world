import React, { memo, useCallback, Suspense } from "react";
import { useGLTF, Html } from "@react-three/drei";
import MeshComponent from "@/components/World/element/MeshComponent";
import { useElementStore } from "@/components/SocketManager";

const ImportGeometry = memo(({ data }) => {
  // const { nodes } = useGLTF(data.model_url);
  const nodes = useElementStore((state) => state.nodes);
  const importGeometryRecursively = useCallback((object, index, nodes) => {
    if (!object) return null;
    if (object.type === "Mesh" || object.type === "CustomMesh") {
      if (nodes[object.name]?.geometry && nodes[object.name]?.material) {
        return (
          <MeshComponent
            key={index}
            id={object.id}
            model={object.model}
            name={object.name}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            geometry={nodes[object.name].geometry}
            material={nodes[object.name].material}
            dispose={null}
          />
        );
      } else {
        return null; // Handle missing data
      }
    } else {
      return (
        <React.Fragment key={index}>
          {object.children.map((child, i) =>
            importGeometryRecursively(child, i, nodes)
          )}
        </React.Fragment>
      );
    }
  }, []);

  return (
    <Suspense fallback={<Html>Loading...</Html>}>
      <MeshComponent
        id={data.id}
        model={data.model}
        name={data.name}
        position={data.position}
        rotation={data.rotation}
        scale={data.scale}
        isSelect={data.isSelect}
      >
        {data?.children?.map((child, index) =>
          importGeometryRecursively(child, index, nodes)
        )}
      </MeshComponent>
    </Suspense>
  );
});

export default ImportGeometry;

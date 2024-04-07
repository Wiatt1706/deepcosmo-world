import React, { memo } from "react";
import { useElementStore } from "@/components/SocketManager";
import MeshComponent from "@/components/World/element/MeshComponent";

const ImportGeometry = memo(({ data }) => {
  const nodes = useElementStore((state) => state.nodes);

  if (!nodes) {
    // 处理未定义的情况，这里可以返回一个加载中状态或其他适当的反馈
    return null;
  }

  const importGeometryRecursively = (object, index) => {
    console.log("ImportGometry", nodes[object.name]);

    if (!object) return null;
    if (object.type === "Mesh" || object.type === "CustomMesh") {
      const { geometry, material } =
        nodes && nodes[object.name] ? nodes[object.name] : {};
      if (geometry && material) {
        return (
          <MeshComponent
            key={index}
            id={object.id}
            model={object.model}
            name={object.name}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            geometry={geometry}
            material={material}
            isRigid={object.is_rigid}
            dispose={null}
          />
        );
      } else {
        return (
          <MeshComponent
            key={index}
            id={object.id}
            model={object.model}
            name={object.name}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            dispose={null}
          />
        );
      }
    } else {
      return object.children?.map((child, i) =>
        importGeometryRecursively(child, i)
      );
    }
  };

  const { geometry, material } =
    nodes && nodes[data.name] ? nodes[data.name] : {};

  console.log(geometry);
  return (
    <>
      {data?.children?.map((child, index) =>
        importGeometryRecursively(child, index)
      ) || (
        <MeshComponent
          id={data.id}
          model={data.model}
          name={data.name}
          position={data.position}
          rotation={data.rotation}
          scale={data.scale}
          geometry={geometry}
          material={material}
          isRigid={data.is_rigid}
          dispose={null}
        />
      )}
    </>
  );
});

ImportGeometry.displayName = "ImportGeometry";
export default ImportGeometry;

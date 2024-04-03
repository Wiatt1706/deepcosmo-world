import React, { useState } from "react";
import MeshComponent from "@/components/World/element/MeshComponent";
import { useTexture } from "@react-three/drei";
function DynamicGeometry({ data }) {
  const [color, setColor] = useState(data.material_color);

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] =
    useTexture(
      [
        data.material_map ? data.material_map : null,
        null,
        data.material_normal_map ? data.material_normal_map : null,
        null,
        null,
      ].filter(Boolean)
    );
  // Define geometry based on type
  let geometry;
  switch (data.model) {
    case "BoxGeometry":
      geometry = <boxGeometry args={data.args} />;
      break;
    case "SphereGeometry":
      geometry = <sphereGeometry args={data.args} />;
      break;
    case "CylinderGeometry":
      geometry = <cylinderGeometry args={data.args} />;
      break;
    case "PlaneGeometry":
      geometry = <planeGeometry args={data.args} />;
      break;
    case "ConeGeometry":
      geometry = <coneGeometry args={data.args} />;
      break;
    // Add more geometry types here if needed
    default:
      geometry = null;
      break;
  }

  // Define material based on type
  let material;
  switch (data.material_type) {
    case "MeshStandardMaterial":
      material = (
        <meshStandardMaterial
          color={color}
          map={colorMap}
          normalMap={normalMap}
        />
      );
      break;
    case "MeshBasicMaterial":
      material = <meshBasicMaterial color={color} map={colorMap} />;
      break;
    // Add more material types here if needed
    default:
      material = null;
  }

  return (
    <MeshComponent
      id={data.id}
      name={data.name}
      model={data.model}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
      isRigid={data.is_rigid}
      isSelect={data.isSelect}
    >
      {geometry}
      {material}
    </MeshComponent>
  );
}

export default DynamicGeometry;

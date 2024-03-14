import React, { useState } from "react";
import MeshComponent from "@/components/World/element/MeshComponent";

function DynamicGeometry({ data, onChange }) {
  const [color, setColor] = useState(data.material_color);

  // Define geometry based on type
  let geometry;
  switch (data.type) {
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
  }

  // Define material based on type
  let material;
  switch (data.material_type) {
    case "MeshStandardMaterial":
      material = (
        <meshStandardMaterial
          color={color}
          map={data.material_map ? data.material_map : null}
          normalMap={data.material_normal_map ? data.material_normal_map : null}
        />
      );
      break;
    case "MeshBasicMaterial":
      material = (
        <meshBasicMaterial
          color={color}
          map={data.material_map ? data.material_map : null}
        />
      );
      break;
    // Add more material types here if needed
    default:
      material = null;
  }

  return (
    <MeshComponent
      id={data.id}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
      isSelect={data.isSelect}
    >
      {geometry}
      {material}
    </MeshComponent>
  );
}

export default DynamicGeometry;

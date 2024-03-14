"use client";
import { Grid } from "@react-three/drei";
export default function GridBox({ size=[50, 50], ...props }) {
  return (
    <group {...props}>
      <Ground args={[size[0], size[1]]} position={[0, -0.01, 0]} />
      <mesh scale={size[0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Ground({ ...props }) {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: "#9d4b4b",
    fadeDistance: 60,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: false,
  };
  return <Grid {...props} {...gridConfig} />;
}

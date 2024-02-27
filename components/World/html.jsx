import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function HtmlTooltip({ children, ...props }) {
  return (
    <Html
      {...props}
      style={{ userSelect: "none" }}
      castShadow
      receiveShadow
      occlude="raycast"
      transform
      portal
    >
      {children}
    </Html>
  );
}

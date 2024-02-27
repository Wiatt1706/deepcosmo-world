import { Html } from "@react-three/drei";

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

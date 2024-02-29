import * as THREE from "three";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { Html } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export function HtmlTooltip({ children, position, ...props }) {
  const viewRef = useRef();
  const [pos, setPos] = useState(() => new THREE.Vector3(...position));

  // Drag n drop, hover
  const [hovered, setHovered] = useState(false);

  const [planeSize, setPlaneSize] = useState({ width: 0, height: 0 }); // Initial siz

  const { size, camera } = useThree();

  useEffect(
    () => void (document.body.style.cursor = hovered ? "grab" : "auto"),
    [hovered]
  );

  useEffect(() => {
    if (viewRef.current) {
      const { offsetWidth, offsetHeight } = viewRef.current;
      console.log(viewRef.current);
      setPlaneSize({ width: offsetWidth / 26, height: offsetHeight / 26 });
    }
  }, [viewRef.current]);

  let planeIntersectPoint = new THREE.Vector3();

  const [spring, api] = useSpring(() => ({
    position: pos,
    scale: 1,
    config: { friction: 20 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      if (active) {
        console.log("x, y", x, y);
        setPos(
          new THREE.Vector3(
            (x / size.width) * 2 - 1,
            -(y / size.height) * 2 + 1,
            0
          )
            .unproject(camera)
            .multiply({ x: 1, y: 0, z: 1 })
            .clone()
        );
      }

      api.start({
        position: pos,
        scale: active ? 1.1 : 1,
      });
      return timeStamp;
    },
    { delay: true }
  );

  return (
    <animated.mesh
      // {...props}
      {...spring}
      {...bind()}
      rotation-x={-Math.PI / 2}
      onPointerOver={() => {
        setHovered(true);
        console.log("onPointerOver");
      }}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[planeSize.width, planeSize.height]} />
      <meshBasicMaterial />

      <Html
        position-z={0.001}
        style={{ userSelect: "none" }}
        occlude="raycast"
        distanceFactor={15}
        transform
        portal
      >
        <Card ref={viewRef} className="bg-[#18181b]">
          <CardHeader className="flex gap-3 mt-2 mx-2">
            <i className="w-4 h-4 bg-[#ff5f59] rounded-full" />
            <i className="w-4 h-4 bg-[#ffbe2c] rounded-full" />
            <i className="w-4 h-4 bg-[#2aca44] rounded-full" />
          </CardHeader>
          <CardBody className="p-0">{children}</CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      </Html>
    </animated.mesh>
  );
}

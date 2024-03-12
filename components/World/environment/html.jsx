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
import { useThree, extend } from "@react-three/fiber";
import { easing, geometry } from "maath";
import "@/components/World/BentPlane";
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });

export function HtmlTooltip({ children, position }) {
  const viewRef = useRef();

  const [pos, setPos] = useState(position);
  const [planeSize, setPlaneSize] = useState({ width: 6, height: 8 }); // Initial siz

  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let planeIntersectPoint = new THREE.Vector3();

  const [spring, api] = useSpring(() => ({
    // position: [0, 0, 0],
    position: pos,
    config: { friction: 10 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y], timeStamp, event }) => {
      if (active) {
        event.ray.intersectPlane(floorPlane, planeIntersectPoint);
        setPos([planeIntersectPoint.x, 0.01, planeIntersectPoint.z]);
      }

      return timeStamp;
    },
    { delay: true }
  );

  return (
    <mesh rotation-x={-Math.PI / 2} position={pos} {...bind()}>
      <roundedPlaneGeometry
        attach="geometry"
        args={[planeSize.width, planeSize.height, 0.5]}
      />
      <meshNormalMaterial attach="material" />

      <mesh
        position={[
          -planeSize.width / 2 + 0.2 + 0.6,
          planeSize.height / 2 - 0.8,
          0,
        ]}
      >
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color={"#ff5f59"} />
      </mesh>

      <mesh
        position={[
          -planeSize.width / 2 + 0.2 + 1.5,
          planeSize.height / 2 - 0.8,
          0,
        ]}
      >
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color={"#ffbe2c"} />
      </mesh>

      <mesh
        position={[
          -planeSize.width / 2 + 0.2 + 2.4,
          planeSize.height / 2 - 0.8,
          0,
        ]}
      >
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color={"#2aca44"} />
      </mesh>
      <Html position-z={0.001} style={{ userSelect: "none" }} transform portal>
        <Card className="bg-[#18181b]">
          
          <CardBody className="p-0">{children}</CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      </Html>
    </mesh>
  );
}

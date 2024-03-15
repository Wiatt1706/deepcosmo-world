"use client";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
  controlStatusAtom,
  mouseStageAtom,
  useStore,
} from "@/components/SocketManager";
import { useThree } from "@react-three/fiber";
export default function Controls({ size, ...props }) {
  const controls = useRef();
  const { scene } = useThree();
  const { target, setTarget } = useStore();
  const [mouseStage] = useAtom(mouseStageAtom);
  const [{ isDragging }] = useAtom(controlStatusAtom);

  useEffect(() => {
    if (target && target.id) {
      let targetMesh = null;
      scene.traverse((node) => {
        if (node.isMesh && node.userData["primaryId"] === target.id) {
          targetMesh = node;
        }
      });
      setTarget({ object: targetMesh, id: target.id });
    }
  }, [target?.id]);
  return (
    <>
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        enableZoom={true}
        enablePan={mouseStage == 1 && !isDragging}
        dampingFactor={1}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.75}
      />

      {target && (
        <TransformControls
          // onMouseUp={() => handleTransformEnd()}
          object={target.object}
          mode={"translate"}
        />
      )}
      {/* <CameraModel /> */}
    </>
  );
}

"use client";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { useRef } from "react";
import { useAtom } from "jotai";
import {
  controlStatusAtom,
  mouseStageAtom,
  useStore,
  listModelsAtom,
} from "@/components/SocketManager";
export default function Controls({ size, ...props }) {
  const controls = useRef();
  const { target, setTarget } = useStore();

  const [listModels, setListModels] = useAtom(listModelsAtom);
  const [mouseStage, setMouseStage] = useAtom(mouseStageAtom);
  const [{ isDragging }] = useAtom(controlStatusAtom);

  
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

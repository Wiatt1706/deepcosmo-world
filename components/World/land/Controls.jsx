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
  useMyStore,
  controlStatusAtom,
  useElementStore,
} from "@/components/SocketManager";
import { useThree } from "@react-three/fiber";
export default function Controls({ size, ...props }) {
  const controls = useRef();
  const { scene } = useThree();
  const [target, setTarget] = useElementStore((state) => [
    state.target,
    state.setTarget,
  ]);
  const [{ isDragging, mouseStage }] = useAtom(controlStatusAtom);
  const [modelList, setModelList] = useMyStore((state) => [
    state.modelList,
    state.setModelList,
  ]);

  const handleTransformEnd = () => {
    if (target && target.id && target.object) {
      const updatedModelList = modelList.map((model) => {
        if (model.id === target.id) {
          return {
            ...model,
            position: target.object.position.toArray(),
            rotation: target.object.rotation.toArray(),
            scale: target.object.scale.toArray(),
          };
        }
        return model;
      });
      setModelList(updatedModelList);
    }
  };

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
          onMouseUp={handleTransformEnd}
          object={target.object}
          mode={"translate"}
        />
      )}
      {/* <CameraModel /> */}
    </>
  );
}

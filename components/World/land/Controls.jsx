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

  const updateModelListRecursively = (
    modelList,
    targetId,
    updatedProperties
  ) => {
    return modelList.map((model) => {
      if (model.id === targetId) {
        // 更新目标模型的属性
        return {
          ...model,
          ...updatedProperties,
        };
      } else if (model.children && model.children.length > 0) {
        // 如果模型具有子节点，则递归更新子节点
        return {
          ...model,
          children: updateModelListRecursively(
            model.children,
            targetId,
            updatedProperties
          ),
        };
      }
      return model;
    });
  };

  const handleTransformEnd = () => {
    if (target && target.id && target.object) {
      // 更新模型列表
      const updatedModelList = updateModelListRecursively(
        modelList,
        target.id,
        {
          position: target.object.position.toArray(),
          rotation: target.object.rotation.toArray(),
          scale: target.object.scale.toArray(),
        }
      );
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

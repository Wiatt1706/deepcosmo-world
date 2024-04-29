import { useEffect, useRef, useState } from "react";
import { useInput } from "@/components/hook/useInput";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuarternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

const directionOffset = ({ forward, backward, left, right }) => {
  var directionOffset = 0; // w

  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; // w+a
    }
    if (right) {
      directionOffset = -Math.PI / 4; // w+d
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (left) {
    directionOffset = Math.PI / 2; // a
  } else if (right) {
    directionOffset = -Math.PI / 2; // d
  }

  return directionOffset;
};

const Player = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [directionLight, setDirectionLight] = useState();

  const model = useGLTF("./models/player.glb");

  const { forward, backward, left, right, shift, jump } = useInput();
  const { actions } = useAnimations(model.animations, model.scene);

  const currentAction = useRef("");
  const group = useRef(null);
  const rigidBody = useRef(null);
  const controlsRef = useRef();
  const camera = useThree((state) => state.camera);

  const { scene } = useThree();

  const updateLightTarget = (moveX, moveZ) => {
    if (directionLight) {
      directionLight.position.x += moveX;
      directionLight.position.z += moveZ;
    }
  };
  const updateCameraTarget = (moveX, moveZ) => {
    // 移动相机
    camera.position.x += moveX;
    camera.position.z += moveZ;
    // 旋转相机
    cameraTarget.x = model.scene.position.x;
    cameraTarget.y = model.scene.position.y + 2;
    cameraTarget.z = model.scene.position.z;
    if (controlsRef.current) {
      controlsRef.current.target = cameraTarget;
    }
  };

  useEffect(() => {
    model.scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });
    // 遍历场景下的children，找到DirectionalLight
    scene.traverse((child) => {
      if (child instanceof THREE.DirectionalLight) {
        // 这里可以对DirectionalLight进行操作
        child.target = model.scene;
        setDirectionLight(child);
      }
    });
  }, []);

  useEffect(() => {
    let action = "";
    setAutoRotate(false);
    if (forward || backward || left || right) {
      action = "walking";
      if (shift) {
        action = "running";
      }
    } else if (jump) {
      action = "jump";
    } else {
      action = "idle";
    }

    if (currentAction.current != action) {
      const nextActionToPlay = actions?.[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.3);
      nextActionToPlay?.reset().fadeIn(0.3).play();
      currentAction.current = action;
    }
    // actions?.idel?.play();
  }, [forward, backward, left, right, shift, jump]);

  useFrame((state, delta) => {
    if (
      currentAction.current == "running" ||
      currentAction.current == "walking"
    ) {
      // 向摄像机方向计算
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      );

      // 对角线移动角偏移
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });

      // 旋转
      rotateQuarternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      );
      model.scene.quaternion.rotateTowards(rotateQuarternion, 0.2);

      // 计算方向
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

      // 移动速度
      const velocity = currentAction.current == "running" ? 8 : 3;

      // 移动
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      model.scene.position.x += moveX;
      model.scene.position.z += moveZ;
      updateLightTarget(moveX, moveZ);
      updateCameraTarget(moveX, moveZ);
    }
  });

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableDamping
        maxPolarAngle={Math.PI / 2}
        autoRotate={autoRotate}
        dampingFactor={0.1}
        minDistance={1}
        maxDistance={5}
        ref={controlsRef}
      />
      <RigidBody colliders="ball" restitution={0.7}>
        <mesh castShadow receiveShadow position={[1, 13, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>
      <primitive object={model.scene} />
    </>
  );
};

export default Player;

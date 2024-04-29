import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  euler,
  quat,
  vec3,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { Controls } from "./index";
import { Character } from "./Character";
import { FLOORS, FLOOR_HEIGHT } from "./GameArena";
import { useStageStore } from "./Experience";

const MOVEMENT_SPEED = 4.2;
const JUMP_FORCE = 8;
const ROTATION_SPEED = 2.5;
const vel = new Vector3();

export const CharacterController = ({
  player = true,
  firstNonDeadPlayer = false,
  ...props
}) => {
  const [animation, setAnimation] = useState("idle");
  const stage = useStageStore((state) => state.stage);
  const { camera } = useThree();

  const [, get] = useKeyboardControls();
  const rb = useRef();
  const inTheAir = useRef(true);
  const landed = useRef(false);

  useFrame(({ camera }) => {
    if (stage === "lobby" || !rb.current || stage !== "game") {
      return;
    }

    const rotVel = {
      x: 0,
      y: 0,
      z: 0,
    };

    const curVel = rb.current.linvel();
    vel.x = 0;
    vel.y = 0;
    vel.z = 0;

    if (get()[Controls.forward]) {
      vel.z += MOVEMENT_SPEED;
    }
    if (get()[Controls.back]) {
      vel.z -= MOVEMENT_SPEED;
    }
    if (get()[Controls.left]) {
      rotVel.y += ROTATION_SPEED;
    }
    if (get()[Controls.right]) {
      rotVel.y -= ROTATION_SPEED;
    }

    rb.current.setAngvel(rotVel);
    // apply rotation to x and z to go in the right direction
    const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
    vel.applyEuler(eulerRot);
    if (get()[Controls.jump] && !inTheAir.current && landed.current) {
      vel.y += JUMP_FORCE;
      inTheAir.current = true;
      landed.current = false;
    } else {
      vel.y = curVel.y;
    }
    if (Math.abs(vel.y) > 1) {
      inTheAir.current = true;
      landed.current = false;
    } else {
      inTheAir.current = false;
    }
    rb.current.setLinvel(vel);

    // Update camera position
    camera.position.copy(rb.current.position);
    camera.position.y += 1.5; // Adjust the height of the camera

    // ANIMATION
    const movement = Math.abs(vel.x) + Math.abs(vel.z);
    if (inTheAir.current && vel.y > 2) {
      setAnimation("jump_up");
    } else if (inTheAir.current && vel.y < -5) {
      setAnimation("fall");
    } else if (movement > 1 || inTheAir.current) {
      setAnimation("run");
    } else {
      setAnimation("idle");
    }
  });

  return (
    <RigidBody
      {...props}
      position-x={0}
      position-z={0}
      colliders={false}
      canSleep={false}
      enabledRotations={[false, true, false]}
      ref={rb}
      onCollisionEnter={(e) => {
        if (e.other.rigidBodyObject.name === "hexagon") {
          inTheAir.current = false;
          landed.current = true;
          const curVel = rb.current.linvel();
          curVel.y = 0;
          rb.current.setLinvel(curVel);
        }
      }}
      gravityScale={stage === "game" ? 2.5 : 0}
      name={player ? "player" : "other"}
    >
      <Character
        scale={0.42}
        color={player ? "blue" : "red"}
        name={player ? "player" : "other"}
        position-y={0.2}
        animation={animation}
      />
      <CapsuleCollider args={[0.1, 0.38]} position={[0, 0.68, 0]} />
    </RigidBody>
  );
};

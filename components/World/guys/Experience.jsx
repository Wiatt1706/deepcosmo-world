import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { GameArena } from "./GameArena";
import { create } from "zustand";
import { CharacterController } from "./CharacterController";

export const useStageStore = create((set) => ({
  stage: "game",
  setStage: (stage) => set({ stage }),
}));

export const Experience = () => {
  const stage = useStageStore((state) => state.stage);

  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (stage === "countdown") {
      camera.position.set(0, 50, -50);
    }
  }, [stage]);

  return (
    <>
      <OrbitControls />
      <GameArena />
      <CharacterController
        position-y={2}
      />
    </>
  );
};

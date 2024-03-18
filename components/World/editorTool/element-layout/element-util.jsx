import { PiEyeBold } from "react-icons/pi";
import { BiCurrentLocation } from "react-icons/bi";
import { useStore, useElementStore } from "@/components/SocketManager";

export const EyeBtn = ({ id }) => {
  const handlePiEyeClick = () => {};
  return <PiEyeBold onClick={handlePiEyeClick} />;
};

export const LoacationBtn = ({ id }) => {
  const setTarget = useStore((state) => state.setTarget);
  const handleBiCurrentLocationClick = () => {
    setTarget({ id });
  };
  return <BiCurrentLocation onClick={handleBiCurrentLocationClick} />;
};

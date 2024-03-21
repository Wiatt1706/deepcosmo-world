import { PiEyeBold } from "react-icons/pi";
import { BiCurrentLocation, BiDownload } from "react-icons/bi";
import { useStore, useExportStore } from "@/components/SocketManager";

export const EyeBtn = ({ id }) => {
  const handlePiEyeClick = () => {};
  return <PiEyeBold onClick={handlePiEyeClick} />;
};

export const ExportBtn = ({ mesh }) => {
  const { setTarget: setExportTarget } = useExportStore();

  const handleClick = () => {
    setExportTarget(mesh);
  };
  return <BiDownload onClick={handleClick} />;
};

export const LoacationBtn = ({ id }) => {
  const setTarget = useStore((state) => state.setTarget);
  const handleBiCurrentLocationClick = () => {
    setTarget({ id });
  };
  return <BiCurrentLocation onClick={handleBiCurrentLocationClick} />;
};

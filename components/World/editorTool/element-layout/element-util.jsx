import { PiEyeBold } from "react-icons/pi";
import { BiCurrentLocation, BiDownload } from "react-icons/bi";
import { useElementStore, useExportStore } from "@/components/SocketManager";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { saveString } from "@/components/utils/DownUrl";
export const EyeBtn = ({ id }) => {
  const handlePiEyeClick = () => {};
  return <PiEyeBold onClick={handlePiEyeClick} />;
};

export const ExportBtn = ({ mesh }) => {
  const exporter = new GLTFExporter();
  const handleClick = () => {
    exporter.parse(
      mesh,
      (result) => {
        // 导出二进制格式
        saveString(JSON.stringify(result), "object.glb");
      },
      { binary: true } // 设置选项对象的 binary 属性为 true
    );
  };

  return <BiDownload onClick={handleClick} />;
};

export const LoacationBtn = ({ id }) => {
  const setTarget = useElementStore((state) => state.setTarget);
  const handleBiCurrentLocationClick = () => {
    setTarget({ id });
  };
  return <BiCurrentLocation onClick={handleBiCurrentLocationClick} />;
};

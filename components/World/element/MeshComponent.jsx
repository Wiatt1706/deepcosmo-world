import React, { useEffect, useRef, useState } from "react";
import { useElementStore, useExportStore } from "@/components/SocketManager";
import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function MeshComponent({ id, type, children, isSelect = false, ...props }) {
  const ref = useRef();
  const setTarget = useElementStore((state) => state.setTarget);
  const { saveTarget, setSaveTarget } = useExportStore();
  const [hovered, setHovered] = useState(false);
  const camera = useThree((state) => state.camera);

  const exporter = new GLTFExporter();

  const supabase = createClientComponentClient();

  useCursor(hovered);

  const uploadData = async ({ filePath, file }) => {
    const { data, error } = await supabase.storage
      .from("model")
      .upload(filePath, file);
    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setTarget({ object: e.object, id });
  };

  const handlePointerMissed = (e) => {
    if (e.type === "click") {
      setTarget(null);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handleSyncSave = () => {
    const filePath = `public/model/${id}.gltf`;
    exporter.parse(ref.current, (result) => {
      uploadData({
        filePath: filePath,
        file: new Blob([JSON.stringify(result)], {
          type: "application/octet-stream",
        }),
      });
    });
    setSaveTarget(false);
  };

  useEffect(() => {
    if (isSelect && ref.current) {
      setTarget({ object: ref.current, id });
      const { x, y, z } = ref.current.position;
      camera.position.set(x, y + 10, z + 10); // 这里的 +5 是一个示例，你可以根据需要进行调整
      camera.lookAt(x, y, z); // 相机朝向目标Mesh
    }
  }, [isSelect]);

  useEffect(() => {
    if (saveTarget && type === "ImportGeometry") {
      handleSyncSave();
    }
  }, [saveTarget]);

  return (
    <mesh
      {...props}
      ref={ref}
      userData={{ primaryId: id }}
      onClick={handleClick}
      onPointerMissed={handlePointerMissed}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </mesh>
  );
}

export default MeshComponent;

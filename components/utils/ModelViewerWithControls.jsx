import { useDeferredValue } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const ModelViewer = ({ glbUrl }) => {
  const deferred = useDeferredValue(glbUrl);
  const { scene } = useGLTF(deferred);
  console.log(scene);
  // 遍历场景中的所有对象，设置接收阴影和投射阴影
  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true; // 开启投射阴影
      node.receiveShadow = true; // 开启接收阴影
    }
  });

  return <primitive object={scene} />;
};

const ModelViewerWithControls = ({ glbUrl }) => {
  return (
    <Canvas camera={{ position: [0, 5, 4.5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <color attach="background" args={["#f0f0f0"]} />
      <ModelViewer glbUrl={glbUrl} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enablePan={false}
        minPolarAngle={-Math.PI / 2.1}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
};

export default ModelViewerWithControls;

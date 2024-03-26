import { useDeferredValue } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";

const convertToMyModelFormat = (scene, modelUrl, pid) => {
  const id = uuidv4();
  const myModel = {
    id,
    pid: pid,
    text: scene.name, // 这里需要根据具体情况设置文本信息
    type: "ImportGeometry",
    position: scene.position.toArray(),
    rotation: scene.rotation.toArray(),
    scale: scene.scale.toArray(),
    model_url: modelUrl,
    children: [],
  };

  scene.children.forEach((child) => {
    myModel.children.push(convertToMyModelFormat(child, null, id));
  });

  return myModel;
};

const ModelViewer = ({ glbUrl, onModelLoad }) => {
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

  // 调用传入的回调函数，并将加载完成后的数据转换成所需格式
  if (onModelLoad) {
    const myModel = convertToMyModelFormat(scene, glbUrl);
    onModelLoad(myModel);
  }

  return <primitive object={scene} />;
};

const ModelViewerWithControls = ({ glbUrl, onModelLoad }) => {
  return (
    <Canvas camera={{ position: [0, 5, 4.5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <color attach="background" args={["#f0f0f0"]} />
      <ModelViewer glbUrl={glbUrl} onModelLoad={onModelLoad} />
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

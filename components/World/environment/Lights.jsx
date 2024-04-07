import { useRef } from "react";

const Lights = () => {
  const lightRef = useRef();

  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <directionalLight
        ref={lightRef}
        position={[0, 10, 10]}
        color={"#ffd700"}
        intensity={1.5}
      />
      <hemisphereLight args={["#654321", "#87CEEB", 0.9]} />
    </>
  );
};

export default Lights;

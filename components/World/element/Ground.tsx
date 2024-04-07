import { ContactShadows } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
const Ground: React.FC = () => {
  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>

        <ContactShadows position={[0, 0, 0]} scale={200} blur={1} far={10} />
      </RigidBody>
    </>
  );
};

export default Ground;

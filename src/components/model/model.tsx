import { useViewer } from "@/context/ViewerProvider/viewer-provider";
import { useCubeTexture } from "@react-three/drei";


interface ModelProps {
    hoveredEntityId?: string;
}

export const Model = () => {
    const { modelEntities } = useViewer();
    const texture = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "/cubeMap/" }
    );
    if (!modelEntities) return null;
    return (
        <group>
            {modelEntities.map((ent, index) => (
                <mesh
                    geometry={ent.bufferGeometry}
                    key={index}
                    onPointerOver={() => console.log(ent.bufferGeometry.id)}
                >
                    <meshPhysicalMaterial
                        envMap={texture}
                        reflectivity={0.01}
                        roughness={0.18}
                        metalness={0.05}
                        color={ent.color}
                    />
                </mesh>
            ))}
        </group>
    );
};

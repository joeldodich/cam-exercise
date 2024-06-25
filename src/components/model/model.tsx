import { useViewer } from "@/context/ViewerProvider/viewer-provider";
import { ModelEntity } from "@/types/global";
import { useCubeTexture } from "@react-three/drei";
import { Dispatch, SetStateAction, useMemo } from "react";
import { BufferGeometry, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import demoFile from "./colored_glb.glb?url";


interface ModelProps {
    setHoveredEntityId: Dispatch<SetStateAction<string | null>>;
}

export const Model = ({ setHoveredEntityId }: ModelProps) => {
    const { modelEntities, setModelEntities, geometryMap, colorization } = useViewer();

    const texture = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "/cubeMap/" }
    );
    const defaultColor = "rgb(120, 120, 120)";

    useMemo(() => {
        new GLTFLoader().load(demoFile, (gltf) => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse((element) => {
                if (element.type !== "Mesh" || !geometryMap) return;

                const meshElement = element as Mesh;
                const elementFixedId = meshElement.name.split("Product_1_")[1];

                newModuleEntities.push({
                    id: elementFixedId,
                    bufferGeometry:
                        meshElement.geometry as BufferGeometry,
                    color: defaultColor,
                    details: geometryMap.get(elementFixedId),
                });
            });
            setModelEntities(newModuleEntities);
        });
    }, [colorization, modelEntities]);

    if (!modelEntities) return null;
    return (
        <group>
            {modelEntities.map((ent, index) => (
                <mesh
                    geometry={ent.bufferGeometry}
                    key={index}
                    onPointerOver={() => setHoveredEntityId(ent.id)}
                    onPointerOut={() => setHoveredEntityId(null)}
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

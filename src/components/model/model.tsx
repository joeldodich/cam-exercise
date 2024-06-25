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
    const { entityMap, setEntityMap, geometryMap, colorization, defaultColor } =
        useViewer();

    const texture = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "/cubeMap/" }
    );

    useMemo(() => {
        const loadedEntities: Map<string, ModelEntity> = new Map();
        new GLTFLoader().load(demoFile, (gltf) => {
            gltf.scene.traverse((element) => {
                if (element.type !== "Mesh" || !geometryMap) return;
                const meshElement = element as Mesh;
                const elementFixedId = meshElement.name.split("Product_1_")[1];
                loadedEntities.set(elementFixedId, {
                    id: elementFixedId,
                    bufferGeometry: meshElement.geometry as BufferGeometry,
                    color: defaultColor,
                    details: geometryMap.get(elementFixedId),
                });
            });
            setEntityMap(loadedEntities);
        });

        return () => {
            loadedEntities.clear();
        };
    }, []);

    if (!entityMap) return null;
    return (
        <group>
            {Array.from(entityMap.values()).map((entity) => (
                <mesh
                    key={entity.id}
                    geometry={entity.bufferGeometry}
                    onPointerEnter={() => setHoveredEntityId(entity.id)}
                    onPointerLeave={() => setHoveredEntityId(null)}
                >
                    <meshStandardMaterial
                        color={entity.color}
                        envMap={texture}
                        metalness={0.5}
                        roughness={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
};

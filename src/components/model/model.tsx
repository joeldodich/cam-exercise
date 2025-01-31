import { useAnalysis } from "@/context/AnalysisProvider/AnalysisProvider";
import { ModelEntity } from "@/types/global";
import { useCubeTexture } from "@react-three/drei";
import { useMemo } from "react";
import { BufferGeometry, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import demoFile from "./colored_glb.glb?url";

export const Model = () => {
    const {
        entityColorMap,
        entityMap,
        setEntityMap,
        geometryMap,
        defaultColor,
        onHoverEntityEnd,
        onHoverEntityStart,
    } = useAnalysis();

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
                    color: entityColorMap.get(elementFixedId) || defaultColor,
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
                    onPointerEnter={() => onHoverEntityStart(entity.id)}
                    onPointerLeave={() => onHoverEntityEnd(entity.id)}
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

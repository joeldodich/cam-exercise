import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import "./model.css";
import rgbToId from "./rgb_id_to_entity_id_map.json";

interface ModelEntity {
    bufferGeometry: THREE.BufferGeometry;
    color: string;
}

const colorToIdMap = rgbToId as Record<string, string>;
let idToColorMap = {} as Record<string, string>;
Object.keys(rgbToId).forEach((entry) => {
    const [r, g, b] = entry.split("-").map(Number);
    idToColorMap[colorToIdMap[entry]] = `rgb(${r}, ${g}, ${b})`;
});

const defaultColor = "rgb(120, 120, 120)";

export const Model = (): JSX.Element => {
    const [modelEnts, setModelEnts] = React.useState<ModelEntity[]>([]);

    React.useEffect(() => {
        new GLTFLoader().load("./colored_glb.glb", (gltf) => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse((element) => {
                if (element.type !== "Mesh") return;

                const meshElement = element as THREE.Mesh;
                const elementFixedId = meshElement.name.split("Product_1_")[1];

                newModuleEntities.push({
                    bufferGeometry:
                        meshElement.geometry as THREE.BufferGeometry,
                    color: idToColorMap[elementFixedId] || defaultColor,
                });
            });
            setModelEnts(newModuleEntities);
        });
    }, []);

    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 300] }}>
                <ambientLight />
                <OrbitControls makeDefault />
                <group>
                    {modelEnts.map((ent, index) => (
                        <mesh geometry={ent.bufferGeometry} key={index}>
                            <meshStandardMaterial color={ent.color} />
                        </mesh>
                    ))}
                </group>
            </Canvas>
        </div>
    );
};

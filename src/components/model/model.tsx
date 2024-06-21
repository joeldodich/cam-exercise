import { Colorization } from "@/App";
import {
	EdgeRelationshipArray,
	EntityGeometryInfo,
	EntityIdPair,
	GraphEdgeType,
	PocketGroupType,
} from "@/types/global";
import { OrbitControls, useCubeTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import rawAdjacencyGraph from "./adjacency_graph.json";
import rawEdgeMetadata from "./adjacency_graph_edge_metadata.json";
import "./model.css";
import rgbToId from "./rgb_id_to_entity_id_map.json";

type RgbString = string; // "Format of rgb(R, G, B)"
interface ModelEntity {
    bufferGeometry: THREE.BufferGeometry;
    color: RgbString;
}

let adjacencyGraph: Record<
    EntityGeometryInfo["entityId"],
    EntityGeometryInfo["entityId"][]
> = rawAdjacencyGraph;

let edgeMetadata: Record<EntityIdPair, EdgeRelationshipArray> =
    rawEdgeMetadata as unknown as Record<EntityIdPair, EdgeRelationshipArray>;

function isConcaveOrTangentConcave(
    edgeRelationshipArray: EdgeRelationshipArray
): boolean {
    return edgeRelationshipArray.some(
        (arrayVal) => arrayVal === GraphEdgeType.CONCAVE
    );
}

// DFS function to populate PocketGroupType
function dfs(
    entityIdKey: EntityGeometryInfo["entityId"],
    currentGroup: PocketGroupType,
    visited: Set<EntityGeometryInfo["entityId"]>
) {
    visited.add(entityIdKey);
    currentGroup.pocketEntities.add(entityIdKey);

    adjacencyGraph[entityIdKey]?.forEach((connectedEntityId) => {
        const entityIdPair: EntityIdPair = `${entityIdKey}-${connectedEntityId}`;
        const edgePairMetadata = edgeMetadata[entityIdPair];

        if (
            isConcaveOrTangentConcave(edgePairMetadata) &&
            !visited.has(connectedEntityId)
        ) {
            dfs(connectedEntityId, currentGroup, visited);
        }
    });
}

const pocketGroups: PocketGroupType[] = [];
const visited = new Set<string>();
let groupId = 0;

Object.keys(adjacencyGraph).forEach((entityId) => {
    if (!visited.has(entityId)) {
        const currentGroup: PocketGroupType = {
            pocketGroupId: groupId.toString(),
            pocketEntities: new Set<string>(),
        };
        dfs(entityId, currentGroup, visited);
        if (currentGroup.pocketEntities.size > 1) {
            pocketGroups.push(currentGroup);
            groupId++;
        }
    }
});

console.log(pocketGroups);

const colorToEntityIdMap = rgbToId as Record<
    string,
    EntityGeometryInfo["entityId"]
>;
let idToColorMap = {} as Record<EntityGeometryInfo["entityId"], RgbString>;
Object.keys(rgbToId).forEach((entry) => {
    const [r, g, b] = entry.split("-").map(Number);
    idToColorMap[colorToEntityIdMap[entry]] = `rgb(${r}, ${g}, ${b})`;
});

const defaultColor = "rgb(120, 120, 120)";

interface ModelProps {
    colorization: Colorization;
}

const applyColorization = (colorizationSelection: Colorization) => {
    let colorMap = {} as Record<EntityGeometryInfo["entityId"], RgbString>;
    switch (colorizationSelection) {
        case Colorization.NONE:
            Object.keys(idToColorMap).forEach((entityId) => {
                colorMap[entityId] = defaultColor;
            });
            return colorMap;
        case Colorization.ENTITY:
            colorMap = idToColorMap;
            return colorMap;
        case Colorization.POCKET:
            pocketGroups.forEach((group) => {
                const randomColor = `rgb(${Math.floor(
                    Math.random() * 256
                )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                )})`;
                group.pocketEntities.forEach((entityId) => {
                    colorMap[entityId] = randomColor;
                });
            });
            return colorMap;
        default:
            return idToColorMap;
    }
};

export const Model = ({ colorization }: ModelProps) => {
    const [modelEnts, setModelEnts] = React.useState<ModelEntity[]>([]);
    const colorMap = applyColorization(colorization);

    const texture = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "../public/cubeMap/" }
    );

    React.useMemo(() => {
        console.log("Loading model...");
        new GLTFLoader().load("./colored_glb.glb", (gltf) => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse((element) => {
                if (element.type !== "Mesh") return;

                const meshElement = element as THREE.Mesh;
                const elementFixedId = meshElement.name.split("Product_1_")[1];

                newModuleEntities.push({
                    bufferGeometry:
                        meshElement.geometry as THREE.BufferGeometry,
                    color: colorMap[elementFixedId] || defaultColor,
                });
            });
            setModelEnts(newModuleEntities);
        });
    }, [colorization]);

    return (
        <div className="bg-primary h-full w-full min-w-full">
            <Canvas
                className="h-full w-full"
                camera={{ position: [0, 0, 300] }}
            >
                <ambientLight />
                <pointLight intensity={1} position={[500, 500, 1000]} />
                <OrbitControls makeDefault />
                {/* <OrthographicCamera
                    makeDefault

                    zoom={1}
                    top={2000}
                    bottom={-2000}
                    left={2000}
                    right={-2000}
                    near={1}
                    far={20000}
                    position={[0, 0, 2000]}
                /> */}
                <group>
                    {modelEnts.map((ent, index) => (
                        <mesh geometry={ent.bufferGeometry} key={index}>
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
            </Canvas>
        </div>
    );
};

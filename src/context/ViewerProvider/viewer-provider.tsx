import {
    EdgeRelationshipArray,
    EntityGeometryInfo,
    EntityIdPair,
    GraphEdgeType,
    PocketGroup,
} from "@/types/global";
import { useCubeTexture } from "@react-three/drei";
import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

import { createContext, useContext, useMemo } from "react";
import rawAdjacencyGraph from "./adjacency_graph.json";
import rawEdgeMetadata from "./adjacency_graph_edge_metadata.json";
import demoFile from "./colored_glb.glb?url";
import entityGeometryInfo from "./entity_geometry_info.json";
import rgbToId from "./rgb_id_to_entity_id_map.json";

type RgbString = string;
interface ModelEntity {
    id: EntityGeometryInfo["entityId"];
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

function dfs(
    entityIdKey: EntityGeometryInfo["entityId"],
    currentGroup: PocketGroup,
    visited: Set<EntityGeometryInfo["entityId"]>
) {
    visited.add(entityIdKey);
    currentGroup.entityIds.add(entityIdKey);

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

const pocketGroups: PocketGroup[] = [];
const visited = new Set<string>();
let groupId = 0;

Object.keys(adjacencyGraph).forEach((entityId) => {
    if (!visited.has(entityId)) {
        const currentGroup: PocketGroup = {
            id: groupId.toString(),
            entityIds: new Set<string>(),
        };
        dfs(entityId, currentGroup, visited);
        if (currentGroup.entityIds.size > 1) {
            pocketGroups.push(currentGroup);
            groupId++;
        }
    }
});

export enum Colorization {
    NONE = "none",
    ENTITY = "entity",
    POCKET = "pocket",
}

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
                group.entityIds.forEach((entityId) => {
                    colorMap[entityId] = randomColor;
                });
            });
            return colorMap;
        default:
            return idToColorMap;
    }
};

const entityGeometryGraph = entityGeometryInfo as EntityGeometryInfo[];

type ViewerContextType = {
    colorization: Colorization;
    texture: THREE.CubeTexture;
    setColorization: (colorization: Colorization) => void;
    modelEntities: ModelEntity[] | null;
    pocketGroups: PocketGroup[];
    geometryGraph: EntityGeometryInfo[];
};

const ViewerContext = createContext<ViewerContextType>({
    colorization: Colorization.NONE,
    texture: new THREE.CubeTexture(),
    setColorization: () => {},
    modelEntities: null,
    geometryGraph: [], // Abstract
    pocketGroups: [], // Abstract
});

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
    const [modelEntities, setModelEntities] = React.useState<
        ModelEntity[] | null
    >(null);
    const [colorization, setColorization] = React.useState<Colorization>(
        Colorization.NONE
    );
    const colorMap = applyColorization(colorization);

    const texture = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "/cubeMap/" }
    );

    /* Load the model and set the model entities */
    modelEntities &&
        pocketGroups.forEach((pocket) => {
            let groupBoundingBox = new THREE.Box3();

            pocket.entityIds.forEach((id) => {
                const mesh = modelEntities.find(
                    (ent) => ent.id === id
                )?.bufferGeometry;
                if (!mesh) return;
                if (!mesh.boundingBox) {
                    mesh.computeBoundingBox();
                }
                mesh.boundingBox && groupBoundingBox.union(mesh.boundingBox);
            });
            pocket.boundingBox = groupBoundingBox;
        });
    /* Load the model and set the model entities */

    useMemo(() => {
        new GLTFLoader().load(demoFile, (gltf) => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse((element) => {
                if (element.type !== "Mesh") return;

                const meshElement = element as THREE.Mesh;
                const elementFixedId = meshElement.name.split("Product_1_")[1];

                newModuleEntities.push({
                    id: elementFixedId,
                    bufferGeometry:
                        meshElement.geometry as THREE.BufferGeometry,
                    color: colorMap[elementFixedId] || defaultColor,
                });
            });
            setModelEntities(newModuleEntities);
        });
    }, [colorization]);

    return (
        <ViewerContext.Provider
            value={{
                colorization,
                setColorization,
                texture,
                modelEntities,
                pocketGroups,
                geometryGraph: entityGeometryGraph,
            }}
        >
            {children}
        </ViewerContext.Provider>
    );
};

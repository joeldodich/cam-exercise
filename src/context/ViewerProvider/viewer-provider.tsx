import {
	Colorization,
	EntityGeometryInfo,
	EntityType,
	ModelEntity,
	PocketGroup,
} from "@/types/global";
import * as React from "react";
import { createContext, useContext, useState } from "react";
import * as THREE from "three";
import rawAdjacencyGraph from "./adjacency_graph.json";
import rawEntityGeometryInfo from "./entity_geometry_info.json";
import { updatePocketGroupings } from "./helpers";

let adjacencyGraph: Record<
    EntityGeometryInfo["entityId"],
    EntityGeometryInfo["entityId"][]
> = rawAdjacencyGraph;

const pocketGroupsResponse: PocketGroup[] = [];
const visited = new Set<string>();
let groupId = 0;

Object.keys(adjacencyGraph).forEach((entityId) => {
    if (!visited.has(entityId)) {
        const currentGroup: PocketGroup = {
            id: groupId.toString(),
            entityIds: new Set<string>(),
        };
        updatePocketGroupings(entityId, currentGroup, visited, adjacencyGraph);
        if (currentGroup.entityIds.size > 1) {
            pocketGroupsResponse.push(currentGroup);
            groupId++;
        }
    }
});

let entityGeometryMapResponse: Map<
    EntityGeometryInfo["entityId"],
    EntityGeometryInfo
> = new Map();
rawEntityGeometryInfo.forEach((entity) => {
    entityGeometryMapResponse.set(entity.entityId, {
        ...entity,
        entityType: EntityType.ENTITY_TYPE_CYLINDER,
        centerUv: new THREE.Vector3(
            entity.centerUv[0],
            entity.centerUv[1],
            entity.centerUv[2]
        ),
        centerPoint: new THREE.Vector3(
            entity.centerPoint[0],
            entity.centerPoint[1],
            entity.centerPoint[2]
        ),
        centerNormal: new THREE.Vector3(
            entity.centerNormal[0],
            entity.centerNormal[1],
            entity.centerNormal[2]
        ),
    });
});

type ViewerContextType = {
    colorization: Colorization;
    setColorization: (colorization: Colorization) => void;
    modelEntities: ModelEntity[] | null;
    setModelEntities: (modelEntities: ModelEntity[]) => void;
    geometryMap: Map<EntityGeometryInfo["entityId"], EntityGeometryInfo> | null;
    pocketGroups: PocketGroup[] | null;
    cameraPosition?: THREE.Vector3;
    setCameraPosition: (position: THREE.Vector3) => void;
};

const ViewerContext = createContext<ViewerContextType>({
    colorization: Colorization.NONE,
    setColorization: () => {},
    modelEntities: null,
    setModelEntities: () => {},
    geometryMap: null, // Abstract
    pocketGroups: null, // Abstract
    cameraPosition: new THREE.Vector3(0, 0, 300),
    setCameraPosition: () => {},
});

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
    const [modelEntities, setModelEntities] = useState<ModelEntity[] | null>(
        null
    );
    const [colorization, setColorization] = useState<Colorization>(
        Colorization.NONE
    );
    const [cameraPosition, setCameraPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 300));
    const pocketGroups = pocketGroupsResponse;
    const geometryMap = entityGeometryMapResponse;

    return (
        <ViewerContext.Provider
            value={{
                colorization,
                setColorization,
                modelEntities,
                setModelEntities,
                pocketGroups,
                geometryMap,
                cameraPosition,
                setCameraPosition,
            }}
        >
            {children}
        </ViewerContext.Provider>
    );
};

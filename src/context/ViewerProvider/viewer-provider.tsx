import {
	Colorization,
	EdgeRelationshipArray,
	EntityGeometryInfo,
	EntityIdPair,
	EntityType,
	GraphEdgeType,
	ModelEntity,
	PocketGroup
} from "@/types/global";
import * as React from "react";
import * as THREE from "three";

import { createContext, useContext } from "react";
import rawAdjacencyGraph from "./adjacency_graph.json";
import rawEdgeMetadata from "./adjacency_graph_edge_metadata.json";
import entityGeometryInfo from "./entity_geometry_info.json";



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

let entityGeometryMap: Map<EntityGeometryInfo["entityId"], EntityGeometryInfo> =
    new Map();
entityGeometryInfo.forEach((entity) => {
    entityGeometryMap.set(entity.entityId, {
        ...entity,
        entityType: EntityType.ENTITY_TYPE_CYLINDER,
        centerUv: new THREE.Vector3(
            entity.centerUv[0],
            entity.centerUv[2],
            -entity.centerUv[1]
        ),
        centerPoint: new THREE.Vector3(
            entity.centerPoint[0],
            entity.centerPoint[2],
            -entity.centerPoint[1]
        ),
        centerNormal: new THREE.Vector3(
            entity.centerNormal[0],
            entity.centerNormal[2],
            -entity.centerNormal[1]
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
};

const ViewerContext = createContext<ViewerContextType>({
    colorization: Colorization.NONE,
    setColorization: () => {},
    modelEntities: null,
	setModelEntities: () => {},
    geometryMap: null, // Abstract
    pocketGroups: null, // Abstract
});

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
    const [modelEntities, setModelEntities] = React.useState<
        ModelEntity[] | null
    >(null);
    const [colorization, setColorization] = React.useState<Colorization>(
        Colorization.NONE
    );

    // const colorMap = applyColorization(colorization);

    // const updatePocketInfo = () => {
    //     let modelEntitiesWithPocketId = modelEntities;
    //     if (!modelEntitiesWithPocketId) return;

    //     pocketGroups.forEach((pocket) => {
    //         let groupBoundingBox = new THREE.Box3();

    //         pocket.entityIds.forEach((id) => {
    //             const entityIndex = modelEntitiesWithPocketId.findIndex(
    //                 (entity) => entity.id === id
    //             );
    //             if (entityIndex === -1) return;
    //             modelEntitiesWithPocketId[entityIndex].featureId = pocket.id;

    //             const mesh =
    //                 modelEntitiesWithPocketId[entityIndex].bufferGeometry;
    //             if (!mesh.boundingBox) {
    //                 mesh.computeBoundingBox();
    //             }

    //             mesh.boundingBox && groupBoundingBox.union(mesh.boundingBox);
    //         });
    //         pocket.boundingBox = groupBoundingBox;
    //     });
    //     setModelEntities(modelEntitiesWithPocketId);
    // };

    return (
        <ViewerContext.Provider
            value={{
                colorization,
                setColorization,
                modelEntities,
				setModelEntities,
                pocketGroups,
                geometryMap: entityGeometryMap,
            }}
        >
            {children}
        </ViewerContext.Provider>
    );
};

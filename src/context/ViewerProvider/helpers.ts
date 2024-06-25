import {
    EdgeRelationshipArray,
    EntityGeometryInfo,
    EntityIdPair,
    GraphEdgeType,
    ModelEntity,
    PocketGroup,
    RgbString,
} from "@/types/global";
import rawEdgeMetadata from "./adjacency_graph_edge_metadata.json";

export const isConcaveOrTangentConcave = (
    edgeRelationshipArray: EdgeRelationshipArray
): boolean => {
    return edgeRelationshipArray.some(
        (arrayVal) => arrayVal === GraphEdgeType.CONCAVE
    );
};

export const updatePocketGroupings = (
    entityIdKey: EntityGeometryInfo["entityId"],
    currentGroup: PocketGroup,
    visited: Set<EntityGeometryInfo["entityId"]>,
    adjacencyGraph: Record<
        EntityGeometryInfo["entityId"],
        EntityGeometryInfo["entityId"][]
    >
) => {
    visited.add(entityIdKey);
    currentGroup.entityIds.add(entityIdKey);

    const edgeMetadata: Record<EntityIdPair, EdgeRelationshipArray> =
        rawEdgeMetadata as unknown as Record<
            EntityIdPair,
            EdgeRelationshipArray
        >;

    adjacencyGraph[entityIdKey]?.forEach((connectedEntityId) => {
        const entityIdPair: EntityIdPair = `${entityIdKey}-${connectedEntityId}`;
        const edgePairMetadata = edgeMetadata[entityIdPair];

        if (
            isConcaveOrTangentConcave(edgePairMetadata) &&
            !visited.has(connectedEntityId)
        ) {
            updatePocketGroupings(
                connectedEntityId,
                currentGroup,
                visited,
                adjacencyGraph
            );
        }
    });
};

export const assignColorToEntities = (
    entities: ModelEntity[],
    color: RgbString = "rgb(120, 120, 120)"
) => {
    return entities.map((entity) => ({
        ...entity,
        color,
    }));
};

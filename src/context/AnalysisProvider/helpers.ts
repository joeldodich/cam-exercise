import {
    Colorization,
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

export const updateColorMapping = (
    colorMap: Map<EntityGeometryInfo["entityId"], RgbString>,
    hoveredSet: Set<EntityGeometryInfo["entityId"]>,
    pocketGroupings: PocketGroup[],
    colorization: Colorization = Colorization.NONE,
    originalColorMap: Map<EntityGeometryInfo["entityId"], RgbString>,
    defaultGlobalColor: RgbString = "rgb(120, 120, 120)"
) => {
    let updatedColorMap: Map<EntityGeometryInfo["entityId"], RgbString> =
        new Map(colorMap);
    let pocketColorMap = new Map<string, string>();

    if (colorization === Colorization.NONE) {
        colorMap.forEach((__, entityId) => {
            updatedColorMap.set(entityId, defaultGlobalColor);
        });
    } else if (colorization === Colorization.ENTITY) {
        colorMap.forEach((__, entityId) => {
            const updatedColor = originalColorMap.get(entityId) as RgbString;
            updatedColorMap.set(entityId, updatedColor);
        });
    } else if (colorization === Colorization.POCKET) {
        pocketGroupings.forEach((pocket) => {
            const fixedPocketColor = originalColorMap.get(
                pocket.entityIds.values().next().value
            );
            pocketColorMap.set(
                pocket.id,
                fixedPocketColor || defaultGlobalColor
            );
        });
        colorMap.forEach((__, entityId) => {
            const parentPocket = pocketGroupings.find((pocket) =>
                pocket.entityIds.has(entityId)
            );
            if (parentPocket !== undefined) {
                updatedColorMap.set(
                    entityId,
                    pocketColorMap.get(parentPocket.id) || defaultGlobalColor
                );
            } else {
                //TODO: This is hiding a bug where the pointer is picking
                // through the model and marking multiple entities as hovered
                updatedColorMap.set(entityId, defaultGlobalColor);
            }
        });
    }

    hoveredSet.forEach((hoveredEntityId) => {
        if (colorMap.has(hoveredEntityId)) {
            updatedColorMap.set(hoveredEntityId, "rgb(0, 0, 255)");
        }
        if (colorization === Colorization.POCKET) {
            pocketGroupings.forEach((pocket) => {
                if (pocket.entityIds.has(hoveredEntityId)) {
                    pocket.entityIds.forEach((entityId) => {
                        updatedColorMap.set(entityId, "rgb(0, 0, 255)");
                    });
                } else {
                    pocket.entityIds.forEach((entityId) => {
                        updatedColorMap.set(
                            entityId,
                            pocketColorMap.get(pocket.id) || defaultGlobalColor
                        );
                    });
                }
            });
        }
    });

    return updatedColorMap as Map<EntityGeometryInfo["entityId"], RgbString>;
};

export const applyColorMapping = (
    entities: Map<EntityGeometryInfo["entityId"], ModelEntity>,
    colorMap: Map<EntityGeometryInfo["entityId"], RgbString>,
    defaultGlobalColor: RgbString = "rgb(120, 120, 120)"
) => {
    const coloredEntities = new Map(entities);
    entities.forEach((entity, entityId) => {
        const color = colorMap.get(entityId);
        coloredEntities.set(entityId, {
            ...entity,
            color: color || defaultGlobalColor,
        });
    });
    return coloredEntities;
};

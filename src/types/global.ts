export interface EntityGeometryInfo {
    entityType: EntityType;
    entityId: string;
    centerUv: number[];
    centerPoint: number[];
    centerNormal: number[];
    area: number;
    minRadius: number;
    minPosRadius: number;
    minNegRadius: number;
    edgeCurveChains: EdgeCurveChain[];
}

export interface EdgeCurveChain {
    edgeType: EdgeType;
    edgeCurves: EdgeCurve[];
}

export type EdgeCurve = {
    startPoint: number[];
    midPoint: number[];
    endPoint: number[];
    startPointNormal: number[];
};

export enum EntityType {
    ENTITY_TYPE_PLANE,
    ENTITY_TYPE_CYLINDER,
    ENTITY_TYPE_ROTATIONAL,
    ENTITY_TYPE_NURBS,
}

export enum EdgeType {
    EDGE_TYPE_OUTER,
    EDGE_TYPE_INNER,
}

export enum GraphEdgeType {
    CONCAVE,
    CONVEX,
    TANGENTIAL,
}

export type EntityIdPair =
    `${EntityGeometryInfo["entityId"]}-${EntityGeometryInfo["entityId"]}`;

export type EdgeRelationshipArray =
    | [GraphEdgeType.CONCAVE]
    | [GraphEdgeType.CONVEX]
    | [GraphEdgeType.TANGENTIAL, GraphEdgeType.CONCAVE | GraphEdgeType.CONVEX];

export type PocketGroup = {
    pocketGroupId: string;
    pocketEntities: Set<EntityGeometryInfo["entityId"]>;
};

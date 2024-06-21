export interface EdgeCurveChain {
    edgeType: EdgeType;
    edgeCurves: EdgeCurve[];
}

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

export type EdgeCurve = {
    startPoint: number[];
    midPoint: number[];
    endPoint: number[];
    startPointNormal: number[];
}

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
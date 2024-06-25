import { Box3, BufferGeometry, Vector3 } from "three";

export type RgbString = string;
export interface EntityGeometryInfo {
    entityType: EntityType;
    entityId: string;
    centerUv: Vector3;
    centerPoint: Vector3;
    centerNormal: Vector3;
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
    startPoint: Vector3;
    midPoint: Vector3;
    endPoint: Vector3;
    startPointNormal: Vector3;
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
    id: string;
    entityIds: Set<EntityGeometryInfo["entityId"]>;
    boundingBox?: Box3;
};

export interface ModelEntity {
    id: EntityGeometryInfo["entityId"];
    bufferGeometry: BufferGeometry;
    color: RgbString;
    featureId?: string;
    details: EntityGeometryInfo | undefined;
}

export enum Colorization {
    NONE = "none",
    ENTITY = "entity",
    POCKET = "pocket",
}

import {
	applyColorMapping,
	updateColorMapping,
} from "@/components/model/helpers";
import {
	Colorization,
	EntityGeometryInfo,
	EntityType,
	ModelEntity,
	PocketGroup,
	RgbString,
} from "@/types/global";
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import rawAdjacencyGraph from "./adjacency_graph.json";
import rawEntityGeometryInfo from "./entity_geometry_info.json";
import { updatePocketGroupings } from "./helpers";
import rgbToId from "./rgb_id_to_entity_id_map.json";

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

const rawColorToEntityIdMap = rgbToId as Record<
    string,
    EntityGeometryInfo["entityId"]
>;
let idToColorMapResponse: Map<EntityGeometryInfo["entityId"], RgbString> =
    new Map();
Object.keys(rawColorToEntityIdMap).forEach((colorString, index) => {
    // debugger;
    const [r, g, b] = colorString.split("-").map(Number);
    const entityId =
        rawColorToEntityIdMap[Object.keys(rawColorToEntityIdMap)[index]];
    idToColorMapResponse.set(entityId, `rgb(${r}, ${g}, ${b})`);
    // debugger;
});

type ViewerContextType = {
    colorization: Colorization;
    setColorization: (colorization: Colorization) => void;
    defaultColor: RgbString;
    entityColorMap: Map<EntityGeometryInfo["entityId"], RgbString>;
    entityMap: Map<EntityGeometryInfo["entityId"], ModelEntity> | null;
    setEntityMap: (
        modelEntities: Map<EntityGeometryInfo["entityId"], ModelEntity>
    ) => void;
    geometryMap: Map<EntityGeometryInfo["entityId"], EntityGeometryInfo> | null;
    pocketGroups: PocketGroup[] | null;
    cameraPosition?: THREE.Vector3;
    setCameraPosition: (position: THREE.Vector3) => void;
    hoveredEntityIds: Set<EntityGeometryInfo["entityId"]>;
    onHoverEntityStart: (entityId: EntityGeometryInfo["entityId"]) => void;
    onHoverEntityEnd: (entityId: EntityGeometryInfo["entityId"]) => void;
    hoveredPocketIds: Set<PocketGroup["id"]>;
};

const ViewerContext = createContext<ViewerContextType>({
    colorization: Colorization.NONE,
    setColorization: () => {},
    defaultColor: "rgb(120, 120, 120)",
    entityColorMap: new Map(),
    entityMap: null,
    setEntityMap: () => {},
    geometryMap: null, // Abstract
    pocketGroups: null, // Abstract
    cameraPosition: new THREE.Vector3(0, 0, 300),
    setCameraPosition: () => {},
    hoveredEntityIds: new Set(),
    onHoverEntityStart: () => {},
    onHoverEntityEnd: () => {},
    hoveredPocketIds: new Set(),
});

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: React.ReactNode }) => {
    const [entityMap, setEntityMap] = useState<Map<
        EntityGeometryInfo["entityId"],
        ModelEntity
    > | null>(null);
    const [colorization, setColorization] = useState<Colorization>(
        Colorization.NONE
    );
    const [entityColorMap, setEntityColorMap] =
        useState<Map<EntityGeometryInfo["entityId"], RgbString>>(
            idToColorMapResponse
        );
    const [cameraPosition, setCameraPosition] = useState<THREE.Vector3>(
        new THREE.Vector3(0, 0, 300)
    );
    const [hoveredEntityIds, setHoveredEntityIds] = useState<
        Set<EntityGeometryInfo["entityId"]>
    >(new Set());
    const hoveredPocketIds = new Set<PocketGroup["id"]>();
    // for each pocket group, if any entity is hovered, add the pocket group id to the set
    pocketGroupsResponse.forEach((pocketGroup) => {
        pocketGroup.entityIds.forEach((entityId) => {
            if (hoveredEntityIds.has(entityId)) {
                hoveredPocketIds.add(pocketGroup.id);
            }
        });
    });

    const pocketGroups = pocketGroupsResponse;
    const geometryMap = entityGeometryMapResponse;

    const onHoverEntityStart = (entityId: EntityGeometryInfo["entityId"]) => {
        setHoveredEntityIds((prev) => new Set(prev.add(entityId)));
    };
    const onHoverEntityEnd = (entityId: EntityGeometryInfo["entityId"]) => {
        setHoveredEntityIds(
            (prev) => new Set([...prev].filter((id) => id !== entityId))
        );
    };

    useEffect(() => {
        if (!entityMap) return;
        const updatedColorMap = updateColorMapping(
            entityColorMap,
            hoveredEntityIds,
            pocketGroups,
            colorization,
            idToColorMapResponse
        );
        const recoloredEntities = applyColorMapping(entityMap, updatedColorMap);
        setEntityColorMap(updatedColorMap);
        setEntityMap(recoloredEntities);
    }, [colorization, hoveredEntityIds, pocketGroups]);

    return (
        <ViewerContext.Provider
            value={{
                colorization,
                setColorization,
                defaultColor: "rgb(120, 120, 120)",
                entityColorMap,
                entityMap,
                setEntityMap,
                pocketGroups,
                geometryMap,
                cameraPosition,
                setCameraPosition,
                hoveredEntityIds,
                onHoverEntityStart,
                onHoverEntityEnd,
                hoveredPocketIds,
            }}
        >
            {children}
        </ViewerContext.Provider>
    );
};

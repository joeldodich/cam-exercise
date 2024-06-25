import {
    Colorization,
    EntityGeometryInfo,
    ModelEntity,
    PocketGroup,
    RgbString,
} from "@/types/global";

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
    // debugger
    if (colorization === Colorization.NONE) {
        colorMap.forEach((color, entityId) => {
            updatedColorMap.set(entityId, defaultGlobalColor);
        });
    } else if (colorization === Colorization.ENTITY) {
        colorMap.forEach((color, entityId) => {
            const updatedColor = originalColorMap.get(entityId) as RgbString;
            console.log(updatedColor);
            updatedColorMap.set(entityId, updatedColor);
        });
    } else if (colorization === Colorization.POCKET) {
        const pocketColorMap = new Map<string, string>();
        pocketGroupings.forEach((pocket) => {
            const fixedPocketColor = colorMap.get(
                pocket.entityIds.values().next().value
            );
            pocketColorMap.set(
                pocket.id,
                fixedPocketColor || defaultGlobalColor
            );
        });
        colorMap.forEach((color, entityId) => {
            const parentPocket = pocketGroupings.find((pocket) =>
                pocket.entityIds.has(entityId)
            );
            if (parentPocket !== undefined) {
                updatedColorMap.set(
                    entityId,
                    pocketColorMap.get(parentPocket.id) || defaultGlobalColor
                );
            } else {
                updatedColorMap.set(entityId, defaultGlobalColor);
            }
        });
    }

    hoveredSet.forEach((entityId) => {
        if (colorMap.has(entityId)) {
            updatedColorMap.set(entityId, "rgb(0, 0, 255)");
        }
        if (colorization === Colorization.POCKET) {
            const parentPocket = pocketGroupings.find((pocket) =>
                pocket.entityIds.has(entityId)
            );
            if (parentPocket !== undefined) {
                parentPocket.entityIds.forEach((entityId) => {
                    updatedColorMap.set(entityId, "rgb(0, 0, 255)");
                });
            }
        }
    });
    // debugger
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

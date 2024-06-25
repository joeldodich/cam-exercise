import {
    Colorization,
    EntityGeometryInfo,
    ModelEntity,
    PocketGroup,
    RgbString,
} from "@/types/global";
import rgbToId from "./rgb_id_to_entity_id_map.json";

const colorToEntityIdMap = rgbToId as Record<
    string,
    EntityGeometryInfo["entityId"]
>;

let idToColorMap = {} as Record<EntityGeometryInfo["entityId"], RgbString>;

Object.keys(rgbToId).forEach((entry) => {
    const [r, g, b] = entry.split("-").map(Number);
    idToColorMap[colorToEntityIdMap[entry]] = `rgb(${r}, ${g}, ${b})`;
});

const generateRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
};

export const colorizeEntities = (
    entities: Map<EntityGeometryInfo["entityId"], ModelEntity>,
    hoveredSet: Set<EntityGeometryInfo["entityId"]>,
    pocketGroupings: PocketGroup[],
    colorization: Colorization = Colorization.NONE,
    defaultColor: RgbString = "rgb(120, 120, 120)"
) => {
    let coloredEntities: Map<EntityGeometryInfo["entityId"], ModelEntity> =
        new Map();

    if (colorization === Colorization.NONE) {
        entities.forEach((entity) => {
            coloredEntities.set(entity.id, { ...entity, color: defaultColor });
        });
    } else if (colorization === Colorization.ENTITY) {
        entities.forEach((entity) => {
            coloredEntities.set(entity.id, {
                ...entity,
                color: idToColorMap[entity.id],
            });
        });
    } else if (colorization === Colorization.POCKET) {
        const pocketColorMap = new Map<string, string>();
        pocketGroupings.forEach((pocket) => {
            pocketColorMap.set(pocket.id, generateRandomColor());
        });
        entities.forEach((entity) => {
            const pocketId = pocketGroupings.find((pocket) =>
                pocket.entityIds.has(entity.id)
            )?.id;
            const color = pocketId
                ? pocketColorMap.get(pocketId) || defaultColor
                : defaultColor;
            coloredEntities.set(entity.id, { ...entity, color });
        });
    }

    hoveredSet.forEach((entityId) => {
        const entity = entities.get(entityId);
        if (entity) {
            coloredEntities.set(entity.id, {
                ...entity,
                color: "rgb(0, 0, 255)",
            });
        }
    });

    return coloredEntities;
};

import { Colorization, EntityGeometryInfo, RgbString } from "@/types/global";
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

const applyColorization = (colorizationSelection: Colorization, defaultColor: RgbString="rgb(120, 120, 120)") => {
    let colorMap = {} as Record<EntityGeometryInfo["entityId"], RgbString>;
    switch (colorizationSelection) {
        case Colorization.NONE:
            Object.keys(idToColorMap).forEach((entityId) => {
                colorMap[entityId] = defaultColor;
            });
            return colorMap;
        case Colorization.ENTITY:
            colorMap = idToColorMap;
            return colorMap;
        case Colorization.POCKET:
            pocketGroups.forEach((group) => {
                const randomColor = `rgb(${Math.floor(
                    Math.random() * 256
                )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                )})`;
                group.entityIds.forEach((entityId) => {
                    colorMap[entityId] = randomColor;
                });
            });
            return colorMap;
        default:
            return idToColorMap;
    }
};
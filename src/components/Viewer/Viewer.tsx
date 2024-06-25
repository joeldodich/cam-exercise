import { useViewer } from "@/context/ViewerProvider/viewer-provider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { Colorization, EntityGeometryInfo, ModelEntity } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { styled } from "styled-components";
import { Vector3 } from "three";
import { Model } from "../model/model";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const ListItem = styled.li<{ isHovered: boolean }>`
    background-color: ${(props) => (props.isHovered ? "lightblue" : "none")};
`;

export const Viewer = () => {
    const {
        entityMap,
        colorization,
        setColorization,
        pocketGroups,
        cameraPosition,
        setCameraPosition,
    } = useViewer();

    const [hoveredEntityId, setHoveredEntityId] = useState<
        EntityGeometryInfo["entityId"] | null
    >(null);

    const ColorToggle = (
        <ToggleGroup
            type="single"
            value={colorization}
            onValueChange={(data: Colorization) => setColorization(data)}
        >
            <ToggleGroupItem value={Colorization.NONE}>None</ToggleGroupItem>
            <ToggleGroupItem value={Colorization.ENTITY}>
                Entity
            </ToggleGroupItem>
            <ToggleGroupItem value={Colorization.POCKET}>
                Pocket
            </ToggleGroupItem>
        </ToggleGroup>
    );

    const handlePocketClick = (pocketId: string) => {
        const entityId = pocketGroups
            ?.find((pocket) => pocket.id === pocketId)
            ?.entityIds.values()
            .next().value as ModelEntity["id"];
        const entity = entityMap?.get(entityId);
        const position = entity?.details?.centerNormal;
        // debugger;
        if (position) {
            console.log("Setting position...", position);
            position.setLength(300);
            setCameraPosition(new Vector3(...position));
        }
    };
    const PocketList = (
        <>
            {pocketGroups?.map((pocket) => {
                const isHovered =
                    hoveredEntityId !== null &&
                    pocket.entityIds.has(hoveredEntityId);
                return (
                    <ListItem
                        key={pocket.id}
                        isHovered={isHovered}
                        // onClick={() => handlePocketClick(pocket.id)}
                    >
                        <strong>Group {pocket.id}</strong>
                        <p>
                            {pocket.boundingBox &&
                                `X: ${pocket.boundingBox.min.x.toFixed(
                                    2
                                )} Y: ${pocket.boundingBox.min.y.toFixed(
                                    2
                                )} Z: ${pocket.boundingBox.min.z.toFixed(2)}`}
                        </p>
                    </ListItem>
                );
            })}
        </>
    );

    return (
        <WorkingLayout headerSlot={ColorToggle} panelSlot={PocketList}>
            {!entityMap && <div>Loading...</div>}
            <Canvas>
                <ambientLight />
                <pointLight intensity={1} position={[500, 500, 1000]} />
                <OrbitControls makeDefault dampingFactor={0.8} />
                <CameraRig cameraPosition={cameraPosition} />
                {/* <OrthographicCamera
                    makeDefault
                    near={1}
                    position={[0, 0, 300]}
                /> */}
                <Model setHoveredEntityId={setHoveredEntityId} />
            </Canvas>
        </WorkingLayout>
    );
};

const CameraRig = ({ cameraPosition }: { cameraPosition?: Vector3 }) => {
    return (
        <OrthographicCamera
            makeDefault
            near={1}
            castShadow
            position={cameraPosition}
        />
    );
};

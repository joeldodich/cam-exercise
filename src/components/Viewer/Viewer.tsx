import { useViewer } from "@/context/ViewerProvider/viewer-provider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { Colorization, EntityGeometryInfo, ModelEntity } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
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
        modelEntities,
        colorization,
        setColorization,
        pocketGroups,
        snapToPosition,
        setSnapToPosition,
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
        //get the first entity in the pocket group
        const entityId = pocketGroups
            ?.find((pocket) => pocket.id === pocketId)
            ?.entityIds.values()
            .next().value as ModelEntity["id"];
        const entity = modelEntities?.find((entity) => entity.id === entityId);
        const position = entity?.details?.centerNormal;
        debugger;
        if (position) {
            setSnapToPosition(new Vector3(...position));
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
                        onClick={() => handlePocketClick(pocket.id)}
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
            {!modelEntities && <div>Loading...</div>}
            <Canvas>
                <ambientLight />
                <pointLight intensity={1} position={[500, 500, 1000]} />
                <OrbitControls
                    makeDefault
                    dampingFactor={0.8}
                />
                <CameraRig
                    snapToPosition={snapToPosition}
                    setSnapToPosition={setSnapToPosition}
                />
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

const CameraRig = ({
    snapToPosition,
    setSnapToPosition,
}: {
    snapToPosition?: Vector3;
    setSnapToPosition: (position?: Vector3) => void;
}) => {
    snapToPosition !== undefined &&
        useFrame((state) => {
            // state.camera.position.lerp(snapToPosition, 0.1);
            state.camera.lookAt(snapToPosition);
            setSnapToPosition(undefined);
        });
    return (
        <OrthographicCamera makeDefault near={1} position={[0,0,300]}  />
    );
};

import {
    Colorization,
    useViewer,
} from "@/context/ViewerProvider/viewer-provider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { EntityGeometryInfo, PocketGroup } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";
import { styled } from "styled-components";
import { Vector3 } from "three";
import { Model } from "../model/model";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const ListItem = styled.li<{ active?: boolean }>`
    background-color: ${(props) => (props.active ? "lightblue" : "none")};
`;

export const Viewer = () => {
    const {
        modelEntities,
        colorization,
        setColorization,
        pocketGroups,
        geometryMap,
    } = useViewer();
    const [cameraPosition, setCameraPosition] = useState(
        new Vector3(0, 0, 300)
    );

    const [hoveredEntityId, setHoveredEntityId] = useState<
        EntityGeometryInfo["entityId"] | null
    >(null);

    const handlePocketClick = (pocketGroup: PocketGroup) => {
        const firstEntityId = pocketGroup.entityIds.entries().next()
            .value as string[];
        const entityDetails = geometryMap?.get(firstEntityId[0]);
        const entity = modelEntities?.find(
            (ent) => ent.id === firstEntityId[0]
        );
        // debugger;
        // console.log(geometryMap);
        // if (entity && entityDetails) {
        //     // entity.bufferGeometry.lookAt(entityDetails?.centerNormal);
        //     useFrame((state) => {
        //         // state.camera.position.lerp({ x, y, z }, 0.1);
        //         state.camera.lookAt(entityDetails?.centerNormal);
        //     });
        // }
        setCameraPosition(entityDetails?.centerPoint || new Vector3(0, 0, 300));
    };

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

    const PocketList = (
        <>
            {pocketGroups?.map((pocket) => {
                const isActive =
                    hoveredEntityId !== null &&
                    pocket.entityIds.has(hoveredEntityId);
                return (
                    <ListItem key={pocket.id} active={isActive}>
                        <Button onClick={() => handlePocketClick(pocket)}>
                            View
                        </Button>
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
                    // onChange={() => controlsRef?.current?.update()}
                    // panSpeed={1}
                    dampingFactor={0.8}
                    domElement={document.body}
                />
                {/* <CameraRig position={cameraPosition} /> */}
                <OrthographicCamera
                    makeDefault
                    near={1}
                    position={[0, 0, 300]}
                />
                <Model />
            </Canvas>
        </WorkingLayout>
    );
};

const CameraRig = ({ position }: { position: Vector3 }) => {
    useThree((state) => {
        state.camera.position.lerp(position, 0.1);
        state.camera.lookAt(position);
    });
    return <OrthographicCamera near={1} position={[0, 0, 300]} />;
};

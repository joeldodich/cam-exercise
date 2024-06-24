import {
    Colorization,
    useViewer,
} from "@/context/ViewerProvider/viewer-provider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { EntityGeometryInfo } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { styled } from "styled-components";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
//create a styled components li that takes in an active prop. When active, make the background color light blue
const ListItem = styled.li<{ active?: boolean }>`
    background-color: ${(props) => (props.active ? "lightblue" : "white")};
`;

export const Viewer = () => {
    const {
        modelEntities,
        texture,
        colorization,
        setColorization,
        pocketGroups,
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

    const PocketList = (
        <>
            {pocketGroups.map((pocket) => {
                const isActive =
                    hoveredEntityId !== null &&
                    pocket.entityIds.has(hoveredEntityId);
                return (
                    <ListItem key={pocket.id} active={isActive}>
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
            {modelEntities && (
                <Canvas>
                    <ambientLight />
                    <pointLight intensity={1} position={[500, 500, 1000]} />
                    <OrbitControls
                        makeDefault
                        // panSpeed={1}
                        dampingFactor={0.8}
                        domElement={document.body}
                    />
                    <OrthographicCamera
                        makeDefault
                        near={1}
                        position={[0, 0, 300]}
                    />
                    <group>
                        {modelEntities.map((ent, index) => (
                            <mesh
                                geometry={ent.bufferGeometry}
                                key={index}
                                onPointerOver={() => setHoveredEntityId(ent.id)}
                            >
                                <meshPhysicalMaterial
                                    envMap={texture}
                                    reflectivity={0.01}
                                    roughness={0.18}
                                    metalness={0.05}
                                    color={ent.color}
                                />
                            </mesh>
                        ))}
                    </group>
                </Canvas>
            )}
        </WorkingLayout>
    );
};

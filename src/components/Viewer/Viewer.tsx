import {
    Colorization,
    useViewer,
} from "@/context/ViewerProvider/viewer-provider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export const Viewer = () => {
    const {
        modelEntities,
        texture,
        colorization,
        setColorization,
        pocketGroups,
    } = useViewer();

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

    // const groupsList = pocketGroups.map((group) => {
    //     return (
    //         <div key={group.id}>
    //             {group.pocketEntities.map((entity) => (
    //                 <div key={entity}>{entity}</div>
    //             ))}
    //         </div>
    //     );
    // }

    return (
        <WorkingLayout headerSlot={ColorToggle} panelSlot={<div>testing</div>}>
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
                                onPointerOver={() =>
                                    console.log(ent.bufferGeometry.id)
                                }
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

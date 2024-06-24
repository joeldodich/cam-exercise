import { Colorization, useViewer } from "@/context/ViewerProvider/viewer-provider";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export const Viewer = () => {
    const { modelEntities, texture, colorization, setColorization } =
        useViewer();

    return (
        <div className="bg-primary h-full w-full min-w-full bg-white">
            <ToggleGroup
                type="single"
                value={colorization}
                onValueChange={(data: Colorization) => setColorization(data)}
            >
                <ToggleGroupItem value={Colorization.NONE}>
                    None
                </ToggleGroupItem>
                <ToggleGroupItem value={Colorization.ENTITY}>
                    Entity
                </ToggleGroupItem>
                <ToggleGroupItem value={Colorization.POCKET}>
                    Pocket
                </ToggleGroupItem>
            </ToggleGroup>
            {!modelEntities && <div className="h-full w-full">Loading...</div>}
            {modelEntities && (
                <Canvas className="h-full w-full">
                    <ambientLight />
                    <pointLight intensity={1} position={[500, 500, 1000]} />
                    <OrbitControls makeDefault />
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
        </div>
    );
};

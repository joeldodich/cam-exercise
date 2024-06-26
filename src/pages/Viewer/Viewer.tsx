import { TitleCard } from "@/components/common/TitleCard/TitleCard";
import { TopNav } from "@/components/TopNav/TopNav";
import { useAnalysis } from "@/context/AnalysisProvider/AnalysisProvider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { Colorization } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { Model } from "../../components/Model/Model";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export const Viewer = () => {
    const {
        entityMap,
        colorization,
        setColorization,
        pocketGroups,
        cameraPosition,
    } = useAnalysis();

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
                return (
                    <TitleCard
                        key={pocket.id}
                        title={`Group ${pocket.id}`}
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={
                            <span className="text-xs">
                                {pocket.boundingBox &&
                                    `X: ${pocket.boundingBox.min.x.toFixed(
                                        2
                                    )} Y: ${pocket.boundingBox.min.y.toFixed(
                                        2
                                    )} Z: ${pocket.boundingBox.min.z.toFixed(
                                        2
                                    )}`}
                            </span>
                        }
                        // isHovered={isHovered}
                        // onClick={() => handlePocketClick(pocket.id)}
                    />
                );
            })}
        </>
    );

    const TopBar = <TopNav>{ColorToggle}</TopNav>;

    return (
        <WorkingLayout headerSlot={TopBar} panelSlot={PocketList}>
            {!entityMap && <div>Loading...</div>}
            <Canvas>
                <ambientLight />
                <pointLight intensity={1} position={[500, 500, 1000]} />
                <OrbitControls makeDefault dampingFactor={0.8} />
                <CameraRig cameraPosition={cameraPosition} />
                <Model />
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

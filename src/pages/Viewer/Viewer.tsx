import { TitleCard } from "@/components/common/TitleCard/TitleCard";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalysis } from "@/context/AnalysisProvider/AnalysisProvider";
import { WorkingLayout } from "@/layouts/WorkingLayout";
import { Colorization, PocketGroup } from "@/types/global";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EyeOff } from "lucide-react";
import styled from "styled-components";
import { Vector3 } from "three";
import { Model } from "../../components/Model/Model";

const StyledPanelHeader = styled.div`
    background: var(
        --ScrollFade,
        linear-gradient(
            180deg,
            #f8fafc 0%,
            rgba(248, 250, 252, 0.95) 80%,
            rgba(248, 250, 252, 0.05) 100%
        )
    );
    position: sticky;
    top: 0;
    z-index: 10;
    text-align: center;
`;

export const Viewer = () => {
    const {
        entityMap,
        colorization,
        setColorization,
        pocketGroups,
        cameraPosition,
        selectedPocketId,
        setSelectedPocketId,
    } = useAnalysis();

    const toggleSelectedPocket = (selection: PocketGroup["id"] | null) => {
        setSelectedPocketId((prev: string | null) =>
            prev === selection ? null : selection
        );
    };

    const selectedPocket = pocketGroups?.find(
        (pocket) => pocket.id === selectedPocketId
    );

    const HideIconWithTooltip = (
        <Tooltip>
            <TooltipTrigger asChild>
                <EyeOff size={16} className="slate-500" />
            </TooltipTrigger>
            <TooltipContent>
                <p>Deselect & Hide Bounding Box</p>
            </TooltipContent>
        </Tooltip>
    );

    const PocketList = (
        <div className="h-full relative">
            <StyledPanelHeader className="sticky pb-4 mt-3 top-0">
                <h3 className="text-lg">Pockets</h3>
                <sub className="text-xs text-slate-500">
                    Select a pocket to view details
                </sub>
            </StyledPanelHeader>
            <div className="flex flex-col gap-2 pb-4">
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
                            active={pocket.id === selectedPocketId}
                            actionSlot={
                                pocket.id === selectedPocketId &&
                                HideIconWithTooltip
                            }
                            onClick={() => toggleSelectedPocket(pocket.id)}
                        />
                    );
                })}
            </div>
        </div>
    );

    return (
        <WorkingLayout panelSlot={PocketList}>
            {!entityMap && <div>Loading...</div>}
            <Canvas>
                <ambientLight />
                <pointLight intensity={1} position={[500, 500, 1000]} />
                <OrbitControls makeDefault dampingFactor={0.8} />
                <CameraRig cameraPosition={cameraPosition} />
                {selectedPocket?.boundingBox && (
                    <box3Helper
                        args={[selectedPocket?.boundingBox, 0x6a5acd]}
                    />
                )}
                <Model />
            </Canvas>
            <Toolbar
                handleSelectColorization={(data: Colorization) =>
                    setColorization(data)
                }
                colorization={colorization}
            />
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

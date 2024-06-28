import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Colorization } from "@/types/global";
import styled from "styled-components";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToolbarProps {
    colorization: Colorization;
    handleSelectColorization: (option: Colorization) => void;
}

const FloatingMenubar = styled(Menubar)`
    position: absolute;
    bottom: 1rem;
    left: 0;
    transform: translateX(200%);
`;

export const Toolbar = ({
    colorization,
    handleSelectColorization,
}: ToolbarProps) => {
    return (
        <FloatingMenubar>
            <MenubarMenu>
                <MenubarTrigger>Display</MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger>Colorization</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarCheckboxItem
                                checked={colorization === Colorization.NONE}
                                onClick={() =>
                                    handleSelectColorization(Colorization.NONE)
                                }
                            >
                                None
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={colorization === Colorization.ENTITY}
                                onClick={() =>
                                    handleSelectColorization(
                                        Colorization.ENTITY
                                    )
                                }
                            >
                                All Surfaces
                            </MenubarCheckboxItem>
                            <MenubarCheckboxItem
                                checked={colorization === Colorization.POCKET}
                                onClick={() =>
                                    handleSelectColorization(
                                        Colorization.POCKET
                                    )
                                }
                            >
                                Pockets
                            </MenubarCheckboxItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <MenubarTrigger className="text-secondary">
                            Shortcuts
                        </MenubarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Coming soon!</p>
                    </TooltipContent>
                </Tooltip>
            </MenubarMenu>
            <MenubarMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <MenubarTrigger className="text-secondary">
                            Units
                        </MenubarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Coming soon!</p>
                    </TooltipContent>
                </Tooltip>
            </MenubarMenu>
        </FloatingMenubar>
    );
};

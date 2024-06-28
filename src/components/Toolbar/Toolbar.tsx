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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToolbarProps {
    colorization: Colorization;
    handleSelectColorization: (option: Colorization) => void;
}

export const Toolbar = ({
    colorization,
    handleSelectColorization,
}: ToolbarProps) => {
    return (
        <Menubar className="absolute bottom-0 left-0 translate-x-1/2">
            <MenubarMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <MenubarTrigger>Shortcuts</MenubarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Coming soon!</p>
                    </TooltipContent>
                </Tooltip>
            </MenubarMenu>
            <MenubarMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <MenubarTrigger>Units</MenubarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Coming soon!</p>
                    </TooltipContent>
                </Tooltip>
            </MenubarMenu>
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
        </Menubar>
    );
};

import { Colorization } from "@/types/global";
import type { Meta, StoryObj } from "@storybook/react";
import { TooltipProvider } from "../ui/tooltip";
import { Toolbar } from "./Toolbar";

const meta: Meta<typeof Toolbar> = {
    component: Toolbar,
    decorators: [
        (Story) => (
            <TooltipProvider>
                <Story />
            </TooltipProvider>
        ),
    ],
    argTypes: {
        colorization: {
            options: Object.values(Colorization),
        },
    },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
    args: {
        colorization: Colorization.ENTITY,
    },
};

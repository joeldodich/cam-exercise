import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PersonAvatar } from "../PersonAvatar/PersonAvatar";
import { TitleCard } from "./TitleCard";

const meta: Meta<typeof TitleCard> = {
    component: TitleCard,
};

export default meta;
type Story = StoryObj<typeof TitleCard>;

export const Default: Story = {
    args: {
        title: "Part Name",
        imageUrl: "https://via.placeholder.com/150",
        size: "sm",
        descriptionSlot: (
            <span className="flex flex-row align-middle items-center gap-1 text-xs text-slate-500 truncate">
                <PersonAvatar className="h-4 w-4" /> Created 6/24/24 at 10:24AM
            </span>
        ),
        active: false,
        onClick: fn(),
    },
};

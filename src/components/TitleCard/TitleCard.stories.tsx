import type { Meta, StoryObj } from "@storybook/react";
import { PersonAvatar } from "../common/PersonAvatar";
import { TitleCard } from "./TitleCard";

const meta: Meta<typeof TitleCard> = {
    component: TitleCard,
};

export default meta;
type Story = StoryObj<typeof TitleCard>;

export const Default: Story = {
    args: {
        title: "Part Nameddddddddddlakdhjsfj;kashdfklj",
        imageUrl: "https://via.placeholder.com/150",
        size: "sm",
        descriptionSlot: (
            <span className="flex flex-row align-middle items-center gap-1 text-xs">
                <PersonAvatar className="h-4 w-4" /> Something
            </span>
        ),
    },
};

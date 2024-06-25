import type { Meta, StoryObj } from "@storybook/react";
import { PersonAvatar } from "./PersonAvatar";

const meta: Meta<typeof PersonAvatar> = {
    component: PersonAvatar,
};

export default meta;
type Story = StoryObj<typeof PersonAvatar>;

export const Default: Story = {
    args: {},
};

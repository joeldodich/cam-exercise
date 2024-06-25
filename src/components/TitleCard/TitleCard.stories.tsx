import type { Meta, StoryObj } from '@storybook/react';
import { TitleCard } from './TitleCard';

const meta: Meta<typeof TitleCard> = {
  component: TitleCard,
};

export default meta;
type Story = StoryObj<typeof TitleCard>;

export const Default: Story = {
  args: {
    title: 'Part Name',
    imageUrl: 'https://via.placeholder.com/150',
    size: 'sm',
  },
};
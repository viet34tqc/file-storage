import { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from '../avatar/avatar';

const DemoAvatar = () => (
  <Avatar className="w-6 h-6">
    <AvatarImage src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" />
    <AvatarFallback>A</AvatarFallback>
  </Avatar>
);

const meta: Meta = {
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Demo: Story = {
  render: () => <DemoAvatar />,
};

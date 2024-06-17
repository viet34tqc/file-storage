import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { Button } from '../button/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const DemoDropDown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Open</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Status Bar</DropdownMenuItem>
      <DropdownMenuItem>Activity Bar</DropdownMenuItem>
      <DropdownMenuItem>Panel</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

function DropdownWithCheckboxItemDemo() {
  const [showStatusBar, setShowStatusBar] = useState<boolean>(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuItem>Activity Bar</DropdownMenuItem>
        <DropdownMenuItem>Panel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta: Meta = {
  component: DropdownMenu,
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const DropdownWithSeperator: Story = {
  render: () => <DemoDropDown />,
};
export const DropdownWithCheckboxItem: Story = {
  render: () => <DropdownWithCheckboxItemDemo />,
};

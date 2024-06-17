import { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const DemoSelect = () => {
  return (
    <Select>
      <SelectTrigger id="type-select" className="w-[180px]">
        <SelectValue placeholder="Type Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="csv">CSV</SelectItem>
        <SelectItem value="pdf">PDF</SelectItem>
      </SelectContent>
    </Select>
  );
};

const meta: Meta = {
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Demo: Story = {
  render: () => <DemoSelect />,
};

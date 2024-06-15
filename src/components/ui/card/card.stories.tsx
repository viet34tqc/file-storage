import { Meta, StoryObj } from '@storybook/react';

import { BellRing } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const DemoCard = () => (
  <Card className="w-[380px]">
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>You have 3 unread messages.</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className=" flex items-center space-x-4 rounded-md border p-4">
        <BellRing />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Push Notifications</p>
          <p className="text-sm text-muted-foreground">
            Send notifications to device.
          </p>
        </div>
      </div>
      <div></div>
    </CardContent>
    <CardFooter>Mark all as read</CardFooter>
  </Card>
);

const meta: Meta = {
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Demo: Story = {
  render: () => <DemoCard />,
};

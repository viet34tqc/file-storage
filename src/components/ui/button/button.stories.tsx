import type { Meta, StoryObj } from '@storybook/react'
import { TvIcon } from 'lucide-react'
import { Button } from './button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Button,
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}

export const IconButton: Story = {
  args: {
    children: <TvIcon />,
    size: 'icon',
  },
}

export const AsChildIsTrue: Story = {
  args: {
    children: <a>This is a link</a>,
    asChild: true,
  },
}

export default meta

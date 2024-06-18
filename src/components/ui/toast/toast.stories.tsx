import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'
import { Button } from '../button/button'
import { Toast } from './toast'
import { Toaster } from './toaster'
import { useToast } from './use-toast'

const DemoToast = (props: ComponentProps<typeof Toast>) => {
  const { variant = 'default' } = props
  const { toast } = useToast()

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant,
            title: 'Message title',
            description: 'Your message has been sent.',
          })
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  )
}

const meta: Meta = {
  component: Toast,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'destructive'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Toast>

export const Demo: Story = {
  args: { variant: 'default' },
  render: (props) => <DemoToast {...props} />,
}

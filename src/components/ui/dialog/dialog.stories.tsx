import { Meta, StoryObj } from '@storybook/react'

import { Button } from '../button/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

const DemoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Lorem ipsum</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">Lorem ipsum</div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const meta: Meta = {
  component: Dialog,
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Demo: Story = {
  render: () => <DemoDialog />,
}

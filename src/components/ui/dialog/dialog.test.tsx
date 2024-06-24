import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button/button'
import { DialogFooter, DialogHeader } from './dialog'

const titleText = 'Modal Title'
const openButtonText = 'Open Modal'
const cancelButtonText = 'Cancel'

const TestDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">{openButtonText}</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{titleText}</DialogTitle>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit">Submit</Button>
        <DialogClose asChild>
          <Button variant="outline">{cancelButtonText}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

describe('Dialog', () => {
  const user = userEvent.setup()

  test('should handle basic dialog flow', async () => {
    render(<TestDialog />)

    expect(screen.queryByText(titleText)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: openButtonText }))

    expect(await screen.findByText(titleText)).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })

    await user.click(cancelButton)

    expect(screen.queryByText(titleText)).not.toBeInTheDocument()
  })
})

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button/button'
import { AlertDialogFooter, AlertDialogHeader } from './alert-dialog'

const titleText = 'Are you absolutely sure?'
const openButtonText = 'Open Dialog'
const cancelButtonText = 'Cancel'

const TestAlertDialog = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button>{openButtonText}</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{titleText}</AlertDialogTitle>
        <AlertDialogDescription>
          This action will mark the file for our deletion process. Files are
          deleted periodically
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

describe('Alert Dialog', () => {
  const user = userEvent.setup()

  test('should handle basic alert dialog flow', async () => {
    render(<TestAlertDialog />)

    expect(screen.queryByText(titleText)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: openButtonText }))

    expect(await screen.findByText(titleText)).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })

    await user.click(cancelButton)

    expect(screen.queryByText(titleText)).not.toBeInTheDocument()
  })

  test('cancel button should focus first', async () => {
    render(<TestAlertDialog />)

    await user.click(screen.getByRole('button', { name: openButtonText }))

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })

    expect(cancelButton).toHaveFocus()
  })
})

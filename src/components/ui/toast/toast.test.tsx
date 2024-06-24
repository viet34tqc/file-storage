import { Toast } from '@radix-ui/react-toast'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Button } from '../button/button'
import { Toaster } from './toaster'
import { useToast } from './use-toast'

const TestToast = (props: ComponentProps<typeof Toast>) => {
  const { toast } = useToast()

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant: 'default',
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

describe('Toast', () => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn() // Mocking hasPointerCapture
  test('should render', async () => {
    render(<TestToast />)
    const triggerButton = screen.getByText('Show Toast')
    expect(triggerButton).toBeInTheDocument()

    await userEvent.click(triggerButton)
    expect(screen.getByText('Message title')).toBeInTheDocument()
    const toasts = screen.getByRole('list')
    const closeButton = within(toasts).getByRole('button')
    await userEvent.click(closeButton)
  })
})

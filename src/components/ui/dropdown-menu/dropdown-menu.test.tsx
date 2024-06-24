import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button/button'

const TestAlertDialog = () => (
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
)

describe('Dropdown Menu', () => {
  const user = userEvent.setup()

  test('should handle basic dialog flow', async () => {
    render(<TestAlertDialog />)

    expect(screen.queryByText('Appearance')).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'Open' })

    await userEvent.click(trigger)

    expect(await screen.findByText('Appearance')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('menuitem')[0])
    expect(screen.queryByText('Appearance')).not.toBeInTheDocument()
  })
})

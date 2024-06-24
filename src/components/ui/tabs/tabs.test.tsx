import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const TestTabs = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      Make changes to your account here.
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
)

describe('Tabs', () => {
  test('should render', () => {
    render(<TestTabs />)
    expect(
      screen.getByText('Make changes to your account here.')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Change your password here.')
    ).not.toBeInTheDocument()
  })

  test('should change tab', async () => {
    render(<TestTabs />)
    const user = userEvent.setup()
    const otherTab = screen.getByText('Password')
    await user.click(otherTab)

    expect(
      screen.queryByText('Make changes to your account here.')
    ).not.toBeInTheDocument()
    expect(screen.getByText('Change your password here.')).toBeInTheDocument()
  })
})

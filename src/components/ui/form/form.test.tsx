import { z } from 'zod'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubmitHandler } from 'react-hook-form'
import { Button } from '../button/button'
import { Input } from '../input'
import {
  FormControl,
  FormField,
  FormForTesting,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

describe('Form', async () => {
  const user = userEvent.setup()
  const testData = {
    title: 'Hello World',
  }

  const schema = z.object({
    title: z.string().min(1, 'Required'),
  })

  test('should render and submit a basic Form component', async () => {
    const handleSubmit = vi.fn() as SubmitHandler<z.infer<typeof schema>>
    render(
      <FormForTesting onSubmit={handleSubmit} schema={schema}>
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button name="submit" type="submit" className="w-full">
          Submit
        </Button>
      </FormForTesting>
    )
    const input = screen.getByLabelText(/title/i)
    await user.type(input, testData.title)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(testData, expect.anything())
    )
  })

  test('should fail submission if validation fails', async () => {
    const handleSubmit = vi.fn() as SubmitHandler<z.infer<typeof schema>>
    render(
      <FormForTesting onSubmit={handleSubmit} schema={schema}>
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button name="submit" type="submit" className="w-full">
          Submit
        </Button>
      </FormForTesting>
    )
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await screen.findByRole('alert')

    expect(handleSubmit).toHaveBeenCalledTimes(0)
  })
})

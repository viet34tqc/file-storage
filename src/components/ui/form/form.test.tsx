import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../button/button'
import { Input } from '../input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

const testData = {
  title: 'Hello World',
}

const schema = z.object({
  title: z.string().min(1, 'Required'),
})

type FieldValues = z.infer<typeof schema>

const TestForm = ({ onSubmit }: { onSubmit: SubmitHandler<FieldValues> }) => {
  const form = useForm<FieldValues>({
    defaultValues: { title: '' },
    resolver: zodResolver(schema),
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
      </form>
    </FormProvider>
  )
}

describe('Form', async () => {
  const user = userEvent.setup()

  test('should render and submit a basic Form component', async () => {
    const handleSubmit = vi.fn() as SubmitHandler<FieldValues>
    render(<TestForm onSubmit={handleSubmit} />)
    const input = screen.getByLabelText(/title/i)
    await user.type(input, testData.title)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(testData, expect.anything())
    )
  })

  test('should fail submission if validation fails', async () => {
    const handleSubmit = vi.fn() as SubmitHandler<FieldValues>
    render(<TestForm onSubmit={handleSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    await screen.findByRole('alert')

    expect(handleSubmit).toHaveBeenCalledTimes(0)
  })
})

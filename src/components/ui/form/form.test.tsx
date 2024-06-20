import { z } from 'zod'

import { expect, test } from 'vitest'

const testData = {
  title: 'Hello World',
}

const schema = z.object({
  title: z.string().min(1, 'Required'),
})

describe('Form', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3)
  })
})

import { createUrl } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useRouterPushParam = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePushParam = (paramName: string, value: string) => {
    // We need to pass searchParams.toString() first, otherwise the current params will be removed
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, value)
    const url = createUrl(pathname, params)
    router.replace(url, { scroll: false })
  }

  return { handlePushParam }
}

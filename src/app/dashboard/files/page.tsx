import { Suspense } from 'react'
import FileBrowser from '../_components/FileBrowser'

export default function FilesPage() {
  return (
    <Suspense>
      <FileBrowser title="Your Files" />
    </Suspense>
  )
}

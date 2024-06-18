import { Loader2 } from 'lucide-react'

const FilesLoader = () => {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
      <div className="text-2xl">Loading your files...</div>
    </div>
  )
}

export default FilesLoader

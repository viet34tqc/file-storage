import Image from 'next/image'
import { UploadButton } from '../UploadButton'

type Props = {}

const NoFiles = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-4 w-full items-center mt-12">
        <Image
          src="/empty.svg"
          width="300"
          height="300"
          alt="An image of picture and directory icon"
        />
        <p>You have no files, upload one now</p>
        <UploadButton />
      </div>
    </div>
  )
}

export default NoFiles

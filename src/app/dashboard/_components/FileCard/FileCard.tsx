import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/card'
import { File } from '@/lib/types'
import { useQuery } from 'convex/react'
import { formatRelative } from 'date-fns'
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'
import { api } from '../../../../../convex/_generated/api'
import FileCardActions from './FileCardActions'

type Props = {
  file: File
}

const typeIcons = {
  image: <ImageIcon />,
  pdf: <FileTextIcon />,
  csv: <GanttChartIcon />,
} as Record<string, ReactNode>

const FileCard = ({ file }: Props) => {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  })

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between gap-2 text-base">
          <div className="flex gap-1 justify-center">
            {typeIcons[file.type]} {file.name}
          </div>
          <FileCardActions file={file} />
        </CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <div className="absolute top-2 right-2"></div>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === 'image' && file.url && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}
        {file.type === 'csv' && <GanttChartIcon className="w-20 h-20" />}
        {file.type === 'pdf' && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-700 gap-1">
        <div className="flex gap-2 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>UserAvatar</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <span>
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </span>
      </CardFooter>
    </Card>
  )
}

export default FileCard

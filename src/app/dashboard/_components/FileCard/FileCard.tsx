import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Doc } from '../../../../../convex/_generated/dataModel';
import FileCardActions from './FileCardActions';

type Props = {
  file: Doc<'files'> & { url: string | null; isFavorited: boolean };
};

const typeIcons = {
  image: <ImageIcon />,
  pdf: <FileTextIcon />,
  csv: <GanttChartIcon />,
} as Record<string, ReactNode>;

const FileCard = ({ file }: Props) => {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>{' '}
          {file.name}
        </CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
        <div className="absolute top-2 right-2">
          <FileCardActions file={file} isFavorited={file.isFavorited} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === 'image' && file.url && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}
        {file.type === 'csv' && <GanttChartIcon className="w-20 h-20" />}
        {file.type === 'pdf' && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            if (file.url) {
              window.open(file.url);
            }
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc } from '../../../../convex/_generated/dataModel';
import FileCardActions from './FileCardActions';

type Props = { file: Doc<'files'> };

const FileCard = ({ file }: Props) => {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>{file.name}</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
        <div className="absolute top-2 right-2">
          <FileCardActions file={file} />
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;

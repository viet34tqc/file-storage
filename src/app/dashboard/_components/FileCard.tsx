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

type Props = { file: Doc<'files'> };

const FileCard = ({ file }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;

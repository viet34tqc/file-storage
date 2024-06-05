import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from 'convex/react';

import { useToast } from '@/components/ui/use-toast';
import { Protect } from '@clerk/nextjs';
import { MoreVertical, StarIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import { Doc } from '../../../../../convex/_generated/dataModel';

type Props = {
  file: Doc<'files'>;
  isFavorited: boolean;
};

const FileCardActions = ({ file, isFavorited }: Props) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteFile({ fileId: file._id });
                  toast({
                    variant: 'default',
                    title: 'File marked for deletion',
                    description: 'Your file will be deleted soon',
                  });
                } catch (error) {
                  toast({
                    variant: 'destructive',
                    title: 'File marked for deletion',
                    description:
                      (error as Error)?.message ?? 'Cannot delete the file',
                  });
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 text-red-600 items-center cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            <div className="flex gap-1 items-center">
              <StarIcon className="w-4 h-4" />{' '}
              {isFavorited ? 'Unfavorite' : 'Favorite'}
            </div>
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuItem
              className="flex gap-1 text-red-600 items-center cursor-pointer"
              onClick={() => setIsConfirmOpen(true)}
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileCardActions;
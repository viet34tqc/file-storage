import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu';
import { useMutation, useQuery } from 'convex/react';

import { useToast } from '@/components/ui/toast/use-toast';
import { File } from '@/lib/types';
import { Protect } from '@clerk/nextjs';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import {
  FileIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';

type Props = {
  file: File;
};

const FileCardActions = ({ file }: Props) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);

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
            onClick={() => {
              if (!file.url) return;
              window.open(file.url, '_blank');
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-1 text-red-600 items-center cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            <div className="flex gap-1 items-center">
              <StarIcon className="w-4 h-4" />{' '}
              {file.isFavorited ? 'Unfavorite' : 'Favorite'}
            </div>
          </DropdownMenuItem>

          {/* Only admin or the author of the file have the delete permission */}
          <Protect
            condition={check =>
              check({
                role: 'admin',
              }) || file.userId === me?._id
            }
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-1 text-red-600 items-center cursor-pointer"
              onClick={() => {
                if (file.isDeleted) {
                  restoreFile({ fileId: file._id });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
            >
              <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                {file.isDeleted ? (
                  <>
                    <UndoIcon className="w-4 h-4" /> Restore
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" /> Delete
                  </>
                )}
              </div>
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileCardActions;

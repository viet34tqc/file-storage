'use client';

import { Button } from '@/components/ui/button/button';
import clsx from 'clsx';
import { FileIcon, StarIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sm:w-40 flex sm:flex-col sm:gap-4 gap-2 flex-wrap">
      <Link href="/dashboard/files">
        <Button
          variant={'link'}
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/files'),
          })}
        >
          <FileIcon /> All Files
        </Button>
      </Link>
      <Link href="/dashboard/favorites">
        <Button
          variant={'link'}
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/favorites'),
          })}
        >
          <StarIcon /> Favorites
        </Button>
      </Link>

      <Link href="/dashboard/trash">
        <Button
          variant={'link'}
          className={clsx('flex gap-2', {
            'text-blue-500': pathname.includes('/dashboard/trash'),
          })}
        >
          <TrashIcon /> Trash
        </Button>
      </Link>
    </div>
  );
}

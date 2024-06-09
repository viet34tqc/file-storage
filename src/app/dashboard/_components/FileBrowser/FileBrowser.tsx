'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization, useUser } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from 'convex/react';
import { formatRelative } from 'date-fns';
import { GridIcon, Loader2, RowsIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { File } from '../../_types';
import FileCard from '../FileCard/FileCard';
import FileCardActions from '../FileCard/FileCardActions';
import { FileTableCell } from '../FilesTable/FileTableCell';
import { FilesTable } from '../FilesTable/FilesTable';
import { UploadButton } from '../UploadButton';
import NoFiles from './NoFiles';
import { SearchBar } from './SearchBar';

type Props = {
  title: string;
};

const columns: ColumnDef<File>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'User',
    cell: ({ row }) => {
      return <FileTableCell userId={row.original.userId} />;
    },
  },
  {
    header: 'Uploaded On',
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions file={row.original} />
        </div>
      );
    },
  },
];

const FileBrowser = ({ title }: Props) => {
  const [query, setQuery] = useState('');
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const pathName = usePathname();
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, pathName } : 'skip'
  ); // If we can't get the orgId or userId, skip the query
  const isLoadingFiles = files === undefined;

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : 'skip'
  );

  const filesWithIsFavoritedAttribute =
    files?.map(file => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        favorite => favorite.fileId === file._id
      ),
    })) ?? [];

  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all');
  return (
    <div>
      <div className="flex justify-between items-center mb-12 flex-wrap gap-2">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <TabsList className="flex gap-4 ">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={newType => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingFiles && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid sm:grid-cols-3 gap-4">
            {filesWithIsFavoritedAttribute?.map(file => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <FilesTable columns={columns} data={filesWithIsFavoritedAttribute} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <NoFiles />}
    </div>
  );
};

export default FileBrowser;

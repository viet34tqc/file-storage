'use client';

import { useRouterPushParam } from '@/app/hooks/useRouterPushParam';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/tabs';
import { File, FileTypeAsOptionValue } from '@/lib/types';
import { useOrganization, useUser } from '@clerk/nextjs';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from 'convex/react';
import { formatRelative } from 'date-fns';
import { GridIcon, RowsIcon } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import FileCard from '../FileCard/FileCard';
import FileCardActions from '../FileCard/FileCardActions';
import { FileTableCell } from '../FilesTable/FileTableCell';
import { FilesTable } from '../FilesTable/FilesTable';
import { UploadButton } from '../UploadButton';
import FilesLoader from './FileLoader';
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
  const searchParams = useSearchParams();
  const [type, setType] = useState<FileTypeAsOptionValue>(() => {
    const fileTypeFromSearchParam = searchParams.get('fileType');
    if (
      fileTypeFromSearchParam &&
      ['all', 'image', 'csv', 'pdf'].includes(fileTypeFromSearchParam)
    ) {
      return fileTypeFromSearchParam as FileTypeAsOptionValue;
    }
    return 'all';
  });

  const [query, setQuery] = useState(() => searchParams.get('query') ?? '');
  const organization = useOrganization();
  const user = useUser();
  const pathName = usePathname();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const files = useQuery(
    api.files.getFiles,
    orgId
      ? { orgId, query, pathName, type: type === 'all' ? undefined : type }
      : 'skip'
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

  const { handlePushParam } = useRouterPushParam();
  const defaultView = searchParams.get('view') ?? 'grid';

  const handleUpdateViewType = (value: string) => {
    handlePushParam('view', value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-12 flex-wrap gap-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadButton />
      </div>

      <Tabs defaultValue={defaultView} onValueChange={handleUpdateViewType}>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <TabsList className="h-12">
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
                setType(newType as FileTypeAsOptionValue);
                handlePushParam('fileType', newType);
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

        <TabsContent value="grid">
          {isLoadingFiles ? (
            <FilesLoader />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filesWithIsFavoritedAttribute?.map(file => {
                return <FileCard key={file._id} file={file} />;
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="table">
          {isLoadingFiles ? (
            <FilesLoader />
          ) : (
            <FilesTable
              columns={columns}
              data={filesWithIsFavoritedAttribute}
            />
          )}
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <NoFiles />}
    </div>
  );
};

export default FileBrowser;

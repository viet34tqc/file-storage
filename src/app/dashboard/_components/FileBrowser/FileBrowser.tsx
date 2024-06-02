'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import FileCard from '../FileCard';
import { UploadButton } from '../UploadButton';
import NoFiles from './NoFiles';
import { SearchBar } from './SearchBar';

type Props = {
  title: string;
};

const FileBrowser = ({ title }: Props) => {
  const [query, setQuery] = useState('');
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : 'skip'); // If we can't get the orgId or userId, skip the query
  const isLoadingFiles = files === undefined;
  return (
    <div>
      {isLoadingFiles && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <p className="text-2xl">Loading your image</p>
        </div>
      )}

      {!isLoadingFiles && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>
          {files.length === 0 && <NoFiles />}
          <div className="grid sm:grid-cols-4 gap-4">
            {files?.map(file => <FileCard key={file._id} file={file} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default FileBrowser;

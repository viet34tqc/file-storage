'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '../../../../../convex/_generated/api';
import FileCard from '../FileCard';
import { UploadButton } from '../UploadButton';
import { SearchBar } from './SearchBar';

type Props = {};

const FileBrowser = (props: Props) => {
  const [query, setQuery] = useState('');
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : 'skip'); // If we can't get the orgId or userId, skip the query
  const isLoading = files === undefined;
  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <p className="text-2xl">Loading your image</p>
        </div>
      )}
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-4 w-full items-center mt-12">
          <Image
            src="/empty.svg"
            width="300"
            height="300"
            alt="An image of picture and directory icon"
          />
          <p>You have no files, upload one now</p>
          <UploadButton />
        </div>
      )}
      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Your files</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>
          <div className="grid sm:grid-cols-4 gap-4">
            {files?.map(file => <FileCard key={file._id} file={file} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default FileBrowser;

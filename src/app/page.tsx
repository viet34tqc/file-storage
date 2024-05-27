'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import FileCard from './dashboard/_components/FileCard';
import { UploadButton } from './dashboard/_components/UploadButton';

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip'); // If we can't get the orgId or userId, skip the query
  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your files</h1>
        <UploadButton />
      </div>
      <div className="grid sm:grid-cols-4 gap-4">
        {files?.map(file => <FileCard key={file._id} file={file} />)}
      </div>
    </main>
  );
}

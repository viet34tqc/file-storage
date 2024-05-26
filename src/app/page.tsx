'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UploadButton } from './dashboard/_components/UploadButton';

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip'); // If we can't get the orgId or userId, skip the query
  return (
    <main className="container mx-auto pt-12">
      <UploadButton />
      {files?.map(file => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const orgId = organization?.organization?.id ?? user?.user?.id;
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip'); // If we can't get the orgId or userId, skip the query
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        onClick={() => {
          if (!orgId) return;
          createFile({ name: 'viet', orgId });
        }}
      >
        Main component
      </Button>
      {files?.map(file => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}

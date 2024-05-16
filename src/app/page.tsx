'use client';

import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Signed in and Signed out buttons will abstract away the session logic */}
      {/* So, if we signed in, we show the sign out button, if we signed out, we show the sign in button */}
      <SignedIn>
        <SignOutButton>Sign out</SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">Sign in now</SignInButton>
      </SignedOut>
      <Button onClick={() => createFile({ name: 'viet' })}>
        Main component
      </Button>
      {files?.map(file => <div key={file.name}>{file.name}</div>)}
    </main>
  );
}

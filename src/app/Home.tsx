import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>Sign out</SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">Sign in now</SignInButton>
      </SignedOut>
      <Button>Main component</Button>
    </main>
  );
}

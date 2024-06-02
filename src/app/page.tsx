'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto pt-12">
      <Link href="/dashboard/files">
        <Button>Go to dashboard</Button>
      </Link>
    </main>
  );
}

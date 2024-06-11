'use client';

import { Suspense } from 'react';
import FileBrowser from '../_components/FileBrowser';

export default function TrashPage() {
  return (
    <Suspense>
      <FileBrowser title="Trash" />
    </Suspense>
  );
}

'use client'

import { Suspense } from 'react'
import FileBrowser from '../_components/FileBrowser'

export default function FavoritesPage() {
  return (
    <Suspense>
      <FileBrowser title="Favorites" />
    </Suspense>
  )
}

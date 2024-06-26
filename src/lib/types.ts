import { Doc } from '../../convex/_generated/dataModel'

export type File = Doc<'files'> & { url: string | null; isFavorited: boolean }
export type FileTypeAsOptionValue = Doc<'files'>['type'] | 'all'

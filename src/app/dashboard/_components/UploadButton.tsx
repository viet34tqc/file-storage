'use client'

import { Button } from '@/components/ui/button/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form'
import { Input } from '@/components/ui/input'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

import { z } from 'zod'

import { useToast } from '@/components/ui/toast/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Doc } from '../../../../convex/_generated/dataModel'

export const typesMap = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'application/pdf': 'pdf',
  'text/csv': 'csv',
} as Record<string, Doc<'files'>['type']>

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, 'Required'),
})

export function UploadButton() {
  const { toast } = useToast()
  const organization = useOrganization()
  let orgId: string | undefined = undefined
  const user = useUser()
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const createFile = useMutation(api.files.createFile)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: undefined,
    },
  })

  // We use fileRef to treat file field as uncontrolled component
  // The reason is because we are using shadcn which required the field to be controlled
  // However, the file input must be uncontrolled component because its value can only be set by a user, and not programmatically. That's why we can't use 'field' property from 'render' method as `field` has 'value' property (which makes the component uncontrolled) while register() doesn't

  const fileRef = form.register('file')

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return

    // Get the short-lived upload URL
    // For more details, see: https://docs.convex.dev/file-storage/upload-files#calling-the-upload-apis-from-a-web-page
    const postUrl = await generateUploadUrl()

    const fileType = values.file[0].type

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': fileType },
      body: values.file[0],
    })
    const { storageId } = await result.json()

    try {
      await createFile({
        name: values.title,
        storageId,
        type: typesMap[values.file[0].type],
        orgId,
      })

      form.reset()

      setIsFileDialogOpen(false)
      toast({
        variant: 'success',
        title: 'File Uploaded',
        description: 'Now everyone can view your file',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Your file could not be uploaded, try again later',
      })
    }
  }

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
          {orgId && (
            <DialogDescription>
              This file will be accessible by anyone in your organization
            </DialogDescription>
          )}
        </DialogHeader>
        {!orgId ? (
          <p className="text-2xl font-bold">Please login to upload file</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

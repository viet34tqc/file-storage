import { Metadata } from 'next'
import SideBar from './_components/SideBar'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="container mx-auto pt-12 min-h-screen">
      <div className="flex flex-wrap gap-8">
        <SideBar />

        <div className="flex-1">{children}</div>
      </div>
    </main>
  )
}

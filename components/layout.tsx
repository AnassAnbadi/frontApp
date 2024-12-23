import React from 'react'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <nav className="w-64 bg-card text-card-foreground p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <ul className="space-y-2">
          <li><Link href="/students" className="hover:underline">Students</Link></li>
          <li><Link href="/professors" className="hover:underline">Professors</Link></li>
          <li><Link href="/modules" className="hover:underline">Modules</Link></li>
          <li><Link href="/departments" className="hover:underline">Departments</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  )
}


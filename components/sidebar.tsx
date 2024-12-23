import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          <li><Link href="/professors" className="hover:underline">Professors</Link></li>
          <li><Link href="/departments" className="hover:underline">Departments</Link></li>
          <li><Link href="/modules" className="hover:underline">Modules</Link></li>
          <li><Link href="/evaluation-methods" className="hover:underline">Evaluation Methods</Link></li>
          <li><Link href="/assignments" className="hover:underline">Assignments</Link></li>
          <li><Link href="/users" className="hover:underline">User Accounts</Link></li>
        </ul>
      </nav>
      <div className="absolute bottom-4">
        <ModeToggle />
      </div>
    </aside>
  )
}


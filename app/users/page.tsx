'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface User {
  id: number
  username: string
  email: string
  role: string
}

const columns = [
  { header: 'Username', accessorKey: 'username' as const },
  { header: 'Email', accessorKey: 'email' as const },
  { header: 'Role', accessorKey: 'role' as const },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'Administrator' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'Professor' },
  ])

  const handleEdit = (user: User) => {
    // Implement edit functionality
    console.log('Edit user:', user)
  }

  const handleDelete = (user: User) => {
    // Implement delete functionality
    console.log('Delete user:', user)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage User Accounts</h1>
      <Button className="mb-4">Add User</Button>
      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


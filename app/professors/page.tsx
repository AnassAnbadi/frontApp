'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface Professor {
  id: number
  name: string
  email: string
  department: string
}

const columns = [
  { header: 'Name', accessorKey: 'name' as const },
  { header: 'Email', accessorKey: 'email' as const },
  { header: 'Department', accessorKey: 'department' as const },
]

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Computer Science' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Mathematics' },
  ])

  const handleEdit = (professor: Professor) => {
    // Implement edit functionality
    console.log('Edit professor:', professor)
  }

  const handleDelete = (professor: Professor) => {
    // Implement delete functionality
    console.log('Delete professor:', professor)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Professors</h1>
      <Button className="mb-4">Add Professor</Button>
      <DataTable
        data={professors}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


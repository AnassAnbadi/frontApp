'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface Assignment {
  id: number
  professor: string
  module: string
  element: string
}

const columns = [
  { header: 'Professor', accessorKey: 'professor' as const },
  { header: 'Module', accessorKey: 'module' as const },
  { header: 'Element', accessorKey: 'element' as const },
]

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, professor: 'John Doe', module: 'Introduction to Programming', element: 'Lectures' },
    { id: 2, professor: 'Jane Smith', module: 'Data Structures', element: 'Projects' },
  ])

  const handleEdit = (assignment: Assignment) => {
    // Implement edit functionality
    console.log('Edit assignment:', assignment)
  }

  const handleDelete = (assignment: Assignment) => {
    // Implement delete functionality
    console.log('Delete assignment:', assignment)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Assignments</h1>
      <Button className="mb-4">Add Assignment</Button>
      <DataTable
        data={assignments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


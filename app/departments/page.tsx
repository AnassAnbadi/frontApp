'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface Department {
  id: number
  name: string
  code: string
}

const columns = [
  { header: 'Name', accessorKey: 'name' as const },
  { header: 'Code', accessorKey: 'code' as const },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'Computer Science', code: 'CS' },
    { id: 2, name: 'Mathematics', code: 'MATH' },
  ])

  const handleEdit = (department: Department) => {
    // Implement edit functionality
    console.log('Edit department:', department)
  }

  const handleDelete = (department: Department) => {
    // Implement delete functionality
    console.log('Delete department:', department)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>
      <Button className="mb-4">Add Department</Button>
      <DataTable
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


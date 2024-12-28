'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface Module {
  id: number
  name: string
  code: string
  elements: string[]
}

const columns = [
  { header: 'Name', accessorKey: 'name' as const },
  { header: 'Code', accessorKey: 'code' as const },
  { header: 'Elements', accessorKey: 'elements' as const },
]

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([
    { id: 1, name: 'Introduction to Programming', code: 'CS101', elements: ['Lectures', 'Labs'] },
    { id: 2, name: 'Data Structures', code: 'CS201', elements: ['Lectures', 'Projects'] },
  ])

  const handleEdit = (module: Module) => {
    // Implement edit functionality
    console.log('Edit module:', module)
  }

  const handleDelete = (module: Module) => {
    // Implement delete functionality
    console.log('Delete module:', module)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Modules</h1>
      <Button className="mb-4">Add Module</Button>
      <DataTable
        data={modules}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


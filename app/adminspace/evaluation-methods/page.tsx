'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface EvaluationMethod {
  id: number
  name: string
  description: string
}

const columns = [
  { header: 'Name', accessorKey: 'name' as const },
  { header: 'Description', accessorKey: 'description' as const },
]

export default function EvaluationMethodsPage() {
  const [evaluationMethods, setEvaluationMethods] = useState<EvaluationMethod[]>([
    { id: 1, name: 'Written Exam', description: 'A traditional written examination' },
    { id: 2, name: 'Project', description: 'A practical project to be completed over time' },
  ])

  const handleEdit = (method: EvaluationMethod) => {
    // Implement edit functionality
    console.log('Edit evaluation method:', method)
  }

  const handleDelete = (method: EvaluationMethod) => {
    // Implement delete functionality
    console.log('Delete evaluation method:', method)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Evaluation Methods</h1>
      <Button className="mb-4">Add Evaluation Method</Button>
      <DataTable
        data={evaluationMethods}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}


import { Layout } from '@/components/layout'
import { EntityCrud } from '@/components/entity-crud'

interface Professor {
  id: number
  name: string
  email: string
  department: string
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function ProfessorsPage() {
  const fetchProfessors = () => fetch(`${API_URL}/professors`).then(res => res.json())
  const createProfessor = (professor: Partial<Professor>) => 
    fetch(`${API_URL}/professors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professor),
    }).then(res => res.json())
  const updateProfessor = (id: number, professor: Partial<Professor>) => 
    fetch(`${API_URL}/professors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professor),
    }).then(res => res.json())
  const deleteProfessor = (id: number) => 
    fetch(`${API_URL}/professors/${id}`, { method: 'DELETE' }).then(res => res.json())

  return (
    <Layout>
      <EntityCrud<Professor>
        entityName="Professors"
        columns={columns}
        fetchItems={fetchProfessors}
        createItem={createProfessor}
        updateItem={updateProfessor}
        deleteItem={deleteProfessor}
      />
    </Layout>
  )
}


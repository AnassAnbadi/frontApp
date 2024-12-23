import { Layout } from '@/components/layout'
import { EntityCrud } from '@/components/entity-crud'

interface Department {
  id: number
  name: string
  code: string
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function DepartmentsPage() {
  const fetchDepartments = () => fetch(`${API_URL}/departments`).then(res => res.json())
  const createDepartment = (department: Partial<Department>) => 
    fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(department),
    }).then(res => res.json())
  const updateDepartment = (id: number, department: Partial<Department>) => 
    fetch(`${API_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(department),
    }).then(res => res.json())
  const deleteDepartment = (id: number) => 
    fetch(`${API_URL}/departments/${id}`, { method: 'DELETE' }).then(res => res.json())

  return (
    <Layout>
      <EntityCrud<Department>
        entityName="Departments"
        columns={columns}
        fetchItems={fetchDepartments}
        createItem={createDepartment}
        updateItem={updateDepartment}
        deleteItem={deleteDepartment}
      />
    </Layout>
  )
}


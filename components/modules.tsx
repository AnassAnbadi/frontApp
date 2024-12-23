import { Layout } from '@/components/layout'
import { EntityCrud } from '@/components/entity-crud'

interface Module {
  id: number
  name: string
  code: string
  credits: number
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'credits', label: 'Credits' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function ModulesPage() {
  const fetchModules = () => fetch(`${API_URL}/modules`).then(res => res.json())
  const createModule = (module: Partial<Module>) => 
    fetch(`${API_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(module),
    }).then(res => res.json())
  const updateModule = (id: number, module: Partial<Module>) => 
    fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(module),
    }).then(res => res.json())
  const deleteModule = (id: number) => 
    fetch(`${API_URL}/modules/${id}`, { method: 'DELETE' }).then(res => res.json())

  return (
    <Layout>
      <EntityCrud<Module>
        entityName="Modules"
        columns={columns}
        fetchItems={fetchModules}
        createItem={createModule}
        updateItem={updateModule}
        deleteItem={deleteModule}
      />
    </Layout>
  )
}


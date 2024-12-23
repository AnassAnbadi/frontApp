import { Layout } from '@/components/layout'
import { EntityCrud } from '@/components/entity-crud'

interface Student {
  id: number
  name: string
  prenom: string
  filliere: number
  sem: number
  note: number
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'prenom', label: 'prenom' },

]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/etudiants'

export default function StudentsPage() {
  const fetchStudents = () => fetch(`${API_URL}/students`).then(res => res.json())
  const createStudent = (student: Partial<Student>) => 
    fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }).then(res => res.json())
  const updateStudent = (id: number, student: Partial<Student>) => 
    fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }).then(res => res.json())
  const deleteStudent = (id: number) => 
    fetch(`${API_URL}/students/${id}`, { method: 'DELETE' }).then(res => res.json())

  return (
    <Layout>
      <EntityCrud<Student>
        entityName="Students"
        columns={columns}
        fetchItems={fetchStudents}
        createItem={createStudent}
        updateItem={updateStudent}
        deleteItem={deleteStudent}
      />
    </Layout>
  )
}


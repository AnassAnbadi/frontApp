import { Professor } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const fetchProfessors = async () => {
  const response = await fetch(`${API_URL}/professeurs`)
  if (!response.ok) {
    throw new Error('Failed to fetch professors')
  }
  return response.json()
}

export const createProfessor = async (professor: Partial<Professor>) => {
  const response = await fetch(`${API_URL}/professeurs/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor),
  })
  return response.json()
}

export const updateProfessor = async (id: number, professor: Partial<Professor>) => {
  const response = await fetch(`${API_URL}/professeurs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor),
  })
  return response.json()
}

export const deleteProfessor = async (id: number) => {
  await fetch(`${API_URL}/professeurs/${id}`, { method: 'DELETE' })
}


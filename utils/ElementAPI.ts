import { Element } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const fetchElements = async (): Promise<Element[]> => {
  const response = await fetch(`${API_URL}/elements`)
  if (!response.ok) {
    throw new Error('Failed to fetch elements')
  }
  return response.json()
}

export const createElement = async (element: Partial<Element>): Promise<Element> => {
  const response = await fetch(`${API_URL}/elements/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(element),
  })
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response:', errorText);
    throw new Error(`Failed to create element: ${response.status} ${response.statusText}`);
  }
  return response.json()
}

export const updateElement = async (id: number, element: Partial<Element>): Promise<Element> => {
  const response = await fetch(`${API_URL}/elements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(element),
  })
  if (!response.ok) {
    throw new Error('Failed to update element')
  }
  return response.json()
}

export const deleteElement = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/elements/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Failed to delete element')
  }
}


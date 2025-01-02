'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Module {
  id: number
  code: string
  intitule: string
  description: string
  semestre: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/modules`)
      if (!response.ok) {
        throw new Error('Failed to fetch modules')
      }
      const data = await response.json()
      setModules(data)
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentModule({ ...currentModule, [e.target.name]: e.target.value })
  }

  const handleEdit = (module: Module) => {
    setCurrentModule(module)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/modules/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete module')
      setModules(modules.filter(module => module.id !== id))
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        const updatedModule = await updateModule(currentModule.id!, currentModule)
        setModules(prevModules => 
          prevModules.map(m => m.id === updatedModule.id ? updatedModule : m)
        )
      } else {
        const newModule = await createModule(currentModule)
        setModules(prevModules => [...prevModules, newModule])
      }
      setIsDialogOpen(false)
      setCurrentModule({})
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving module:', error)
    }
  }

  const createModule = async (module: Partial<Module>) => {
    const response = await fetch(`${API_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(module),
    })
    if (!response.ok) throw new Error('Failed to create module')
    return response.json()
  }

  const updateModule = async (id: number, module: Partial<Module>) => {
    const updateResponse = await fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(module),
    })
    if (!updateResponse.ok) throw new Error('Failed to update module')
    
    const getResponse = await fetch(`${API_URL}/modules/${id}`)
    if (!getResponse.ok) throw new Error('Failed to fetch updated module')
    return getResponse.json()
  }

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des modules...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Modules</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => { setIsEditing(false); setCurrentModule({}); }}
            >
              Ajouter un module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Modifier le module' : 'Ajouter un nouveau module'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={currentModule.code || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="intitule">Intitulé</Label>
                <Input
                  id="intitule"
                  name="intitule"
                  value={currentModule.intitule || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={currentModule.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="semestre">Semestre</Label>
                <Input
                  id="semestre"
                  name="semestre"
                  value={currentModule.semestre || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit">
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-[#1f2937]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">CODE</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">INTITULÉ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">DESCRIPTION</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">SEMESTRE</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr 
                key={module.id} 
                className="border-b border-gray-700 bg-[#1f2937] hover:bg-[#374151] transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-300">{module.id}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{module.code}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{module.intitule}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{module.description}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{module.semestre}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(module)}
                    className="bg-black text-white hover:bg-gray-900"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(module.id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


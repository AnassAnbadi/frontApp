'use client'

import { useState, useEffect } from 'react'
import { EntityCrud } from '@/components/EntityCrud'
import { ElementForm } from '@/components/ElementForm'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Element } from '@/types'
import { fetchElements, createElement, updateElement, deleteElement } from '@/utils/ElementAPI'

const columns = [
  { header: "ID", accessorKey: "id" as keyof Element},
  { header: "Nom de l'élément", accessorKey: "nomElement" as keyof Element},
  { header: "Coefficient", accessorKey: "coefficient" as keyof Element},
  { 
    header: "Module",
    accessorKey: "module" as keyof Element,
    cell: (info: Element) => info.module?.nomModule 
  },
  { 
    header: "Professeur", 
    accessorKey: "professeur" as keyof Element,
    cell: (info: Element) => info.professeur?.nom 
  },
];

export default function ElementsPage() {
  const [elements, setElements] = useState<Element[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentElement, setCurrentElement] = useState<Partial<Element>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchElements().then(data => {
      console.log("dabaaa",data);
      setElements(data)
      setIsLoading(false)
    }).catch(error => {
      console.error("Error fetching elements:", error)
      setIsLoading(false)
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentElement({ ...currentElement, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: any) => {
    setCurrentElement({ ...currentElement, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        const updatedElement = await updateElement(currentElement.id!, currentElement)
        setElements(elements.map(el => el.id === updatedElement.id ? updatedElement : el))
      } else {
        console.log(currentElement,"hada dial element")
        const newElement = await createElement(currentElement)
        setElements([...elements, newElement])
      }
      setIsDialogOpen(false)
      setCurrentElement({})
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving element:", error)
    }
  }

  const handleEdit = (element: Element) => {
    setCurrentElement(element)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: keyof Element) => {
    try {
      await deleteElement(Number(id))
      setElements(elements.filter(el => el.id !== Number(id)))
    } catch (error) {
      console.error("Error deleting element:", error)
    }
  }

  if (isLoading) {
    return <div>Chargement des éléments...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Éléments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); setCurrentElement({}); }}>
              Ajouter un élément
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Modifier l\'élément' : 'Ajouter un nouvel élément'}</DialogTitle>
            </DialogHeader>
            <ElementForm
              element={currentElement}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Element>
        entityName="Éléments"
        columns={columns}
        items={elements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  )
}

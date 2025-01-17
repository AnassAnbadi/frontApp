import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Element, Module, Professor } from '@/types'
import { fetchModules } from '@/utils/ModuleAPI'
import { fetchProfessors } from '@/utils/api'

interface ElementFormProps {
  element: Partial<Element>
  isEditing: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ElementForm({ element, isEditing, onInputChange, onSelectChange, onSubmit }: ElementFormProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulesData, professorsData] = await Promise.all([
          fetchModules(),
          fetchProfessors()
        ])
        setModules(modulesData)
        setProfessors(professorsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e);
    }} className="space-y-4">
      <div>
        <Label htmlFor="nomElement">Nom de l'élément</Label>
        <Input
          id="nomElement"
          name="nomElement"
          value={element.nomElement || ''}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="coefficient">Coefficient</Label>
        <Input
          id="coefficient"
          name="coefficient"
          type="number"
          step="0.01"
          value={element.coefficient || ''}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="module">Module</Label>
        <Select 
          value={element.module?.id.toString()} 
          onValueChange={(value) => onSelectChange('module', modules.find(m => m.id.toString() === value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id.toString()}>
                {module.nomModule}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="professeur">Professeur</Label>
        <Select 
          value={element.professeur?.nom.toString()} 
          onValueChange={(value) => onSelectChange('professeur', professors.find(p => p.nom.toString() === value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un professeur" />
          </SelectTrigger>
          <SelectContent>
            {professors.map((professor) => (
              <SelectItem key={professor.nom} value={professor.nom.toString()}>
                {`${professor.nom} ${professor.prenom}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{isEditing ? 'Mettre à jour' : 'Ajouter'}</Button>
    </form>
  )
}


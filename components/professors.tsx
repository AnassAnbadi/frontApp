'use client'

import { useState, useEffect } from 'react'
import { EntityCrud } from './EntityCrud'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Professor {
  code: number
  nom: string
  prenom: string
  nomUtilisateur: string
  motDePasse: string
  image: string
  specialite: string
}

const columns: { header: string; accessorKey: keyof Professor }[] = [
  { header: 'Code', accessorKey: 'code' },
  { header: 'Nom', accessorKey: 'nom' },
  { header: 'Prénom', accessorKey: 'prenom' },
  { header: 'Nom Utilisateur', accessorKey: 'nomUtilisateur' },
  { header: 'Spécialité', accessorKey: 'specialite' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProfessor, setCurrentProfessor] = useState<Partial<Professor>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/professeurs`)
      if (!response.ok) {
        throw new Error('Failed to fetch professors')
      }
      const data = await response.json()
      setProfessors(data)
    } catch (error) {
      console.error('Error fetching professors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createProfessor = async (professor: Partial<Professor>) => {
    const response = await fetch(`${API_URL}/professeurs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professor),
    })
    const newProfessor = await response.json()
    setProfessors(prevProfessors => [...prevProfessors, newProfessor])
    setIsDialogOpen(false)
    setCurrentProfessor({})
    return newProfessor
  }

  const handleEdit = (professor: Professor) => {
    setCurrentProfessor(professor)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: keyof Professor) => {
    await fetch(`${API_URL}/professeurs/${Number(id)}`, { method: 'DELETE' })
    setProfessors(prevProfessors => prevProfessors.filter(p => p.code !== Number(id)))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProfessor({ ...currentProfessor, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedProfessor = await updateProfessor(currentProfessor.code!, currentProfessor);
        setProfessors(prevProfessors => 
          prevProfessors.map(p => p.code === updatedProfessor.code ? updatedProfessor : p)
        );
      } else {
        const newProfessor = await createProfessor(currentProfessor);
        setProfessors(prevProfessors => [...prevProfessors, newProfessor]);
      }
      setIsDialogOpen(false);
      setCurrentProfessor({});
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating/creating professor:', error);
      // Vous pouvez ajouter ici une notification d'erreur pour l'utilisateur
    }
  };

  const updateProfessor = async (id: number, professor: Partial<Professor>) => {
    const updateResponse = await fetch(`${API_URL}/professeurs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professor),
    });
    if (!updateResponse.ok) {
      throw new Error('Failed to update professor');
    }
    
    // Récupérer les données mises à jour à partir de la base de données
    const getResponse = await fetch(`${API_URL}/professeurs/${id}`);
    if (!getResponse.ok) {
      throw new Error('Failed to fetch updated professor data');
    }
    const updatedProfessor = await getResponse.json();
    return updatedProfessor;
  };

  if (isLoading) {
    return <div>Chargement des professeurs...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Professeurs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); setCurrentProfessor({}); }}>
              Ajouter un professeur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Modifier le professeur' : 'Ajouter un nouveau professeur'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={currentProfessor.nom || ''} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" value={currentProfessor.prenom || ''} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="nomUtilisateur">Nom d'utilisateur</Label>
                <Input id="nomUtilisateur" name="nomUtilisateur" value={currentProfessor.nomUtilisateur || ''} onChange={handleInputChange} required />
              </div>
              {!isEditing && (
                <div>
                  <Label htmlFor="motDePasse">Mot de passe</Label>
                  <Input id="motDePasse" name="motDePasse" type="password" value={currentProfessor.motDePasse || ''} onChange={handleInputChange} required />
                </div>
              )}
              <div>
                <Label htmlFor="specialite">Spécialité</Label>
                <Input id="specialite" name="specialite" value={currentProfessor.specialite || ''} onChange={handleInputChange} required />
              </div>
              <Button type="submit">{isEditing ? 'Mettre à jour' : 'Ajouter'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Professor>
        entityName="Professeurs"
        columns={columns}
        items={professors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="code"
      />
    </div>
  )
}


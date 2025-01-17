// 'use client'

// import { useState, useEffect } from 'react'
// import { EntityCrud } from './EntityCrud'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// interface module {
//   id: number
//   nomModule: string
//   semestre: string
//   filiere: string
// }

// const columns: { header: string; accessorKey: keyof module }[] = [
//   { header: 'id', accessorKey: 'id' },
//   { header: 'nomModule', accessorKey: 'nomModule' },
//   { header: 'semestre', accessorKey: 'semestre' },
//   { header: 'filiere', accessorKey: 'filiere' },
// ]

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// export default function modulesPage() {
//   const [professors, setProfessors] = useState<module[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [currentProfessor, setCurrentProfessor] = useState<Partial<module>>({})
//   const [isEditing, setIsEditing] = useState(false)

//   useEffect(() => {
//     fetchModules()
//   }, [])

//   const fetchModules = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`${API_URL}/module`)
//       if (!response.ok) {
//         throw new Error('Failed to fetch professors')
//       }
//       const data = await response.json()
//       setProfessors(data)
//     } catch (error) {
//       console.error('Error fetching professors:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const createmodule = async (professor: Partial<module>) => {
//     const response = await fetch(`${API_URL}/module`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(professor),
//     })
//     const newProfessor = await response.json()
//     setProfessors(prevProfessors => [...prevProfessors, newProfessor])
//     setIsDialogOpen(false)
//     setCurrentProfessor({})
//     return newProfessor
//   }

//   const handleEdit = (module: module) => {
//     setCurrentProfessor(module)
//     setIsEditing(true)
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (id: keyof module) => {
//     await fetch(`${API_URL}/module/${Number(id)}`, { method: 'DELETE' })
//     setProfessors(prevmodule => prevmodule.filter(p => p.id !== Number(id)))
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrentmodule({ ...currentModule, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         const updatedProfessor = await updateProfessor(currentProfessor.code!, currentProfessor);
//         setProfessors(prevProfessors => 
//           prevProfessors.map(p => p.id === updatedProfessor.code ? updatedProfessor : p)
//         );
//       } else {
//         const newmodule = await createmodule(currentModule);
//         setProfessors(prevmodules => [...prevModules, newModule]);
//       }
//       setIsDialogOpen(false);
//       setCurrentProfessor({});
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating/creating professor:', error);
//       // Vous pouvez ajouter ici une notification d'erreur pour l'utilisateur
//     }
//   };

//   const updateProfessor = async (id: number, professor: Partial<module>) => {
//     const updateResponse = await fetch(`${API_URL}/module/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(professor),
//     });
//     if (!updateResponse.ok) {
//       throw new Error('Failed to update professor');
//     }
    
//     // Récupérer les données mises à jour à partir de la base de données
//     const getResponse = await fetch(`${API_URL}/module/${id}`);
//     if (!getResponse.ok) {
//       throw new Error('Failed to fetch updated module data');
//     }
//     const updatedmodule = await getResponse.json();
//     return updatedmodule;
//   };

//   if (isLoading) {
//     return <div>Chargement des modules...</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Professeurs</h1>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => { setIsEditing(false); setCurrentmodule({}); }}>
//               Ajouter un professeur
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{isEditing ? 'Modifier le professeur' : 'Ajouter un nouveau module'}</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <Label htmlFor="nom">Nom</Label>
//                 <Input id="nom" name="nom" value={currentProfessor.nom || ''} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <Label htmlFor="prenom">Prénom</Label>
//                 <Input id="prenom" name="prenom" value={currentProfessor.prenom || ''} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <Label htmlFor="nomUtilisateur">Nom d'utilisateur</Label>
//                 <Input id="nomUtilisateur" name="nomUtilisateur" value={currentProfessor.nomUtilisateur || ''} onChange={handleInputChange} required />
//               </div>
//               {!isEditing && (
//                 <div>
//                   <Label htmlFor="motDePasse">Mot de passe</Label>
//                   <Input id="motDePasse" name="motDePasse" type="password" value={currentProfessor.motDePasse || ''} onChange={handleInputChange} required />
//                 </div>
//               )}
//               <Button type="submit">{isEditing ? 'Mettre à jour' : 'Ajouter'}</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <EntityCrud<module>
//         entityName="modules"
//         columns={columns}
//         items={professors}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         primaryKey="id"
//       />
//     </div>
//   )
// }


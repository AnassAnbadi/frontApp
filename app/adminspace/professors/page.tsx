"use client";

import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/EntityCrud";
import { ProfessorForm } from "@/components/ProfessorForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Professor, Column } from "@/types";
import {
  fetchProfessors,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from "@/utils/api";

const columns: { header: string; accessorKey: keyof Professor }[] = [
  { header: "id", accessorKey: "id" },
  { header: "Nom", accessorKey: "nom" },
  { header: "Prénom", accessorKey: "prenom" },
  { header: "username", accessorKey: "username" },
  { header: "Spécialité", accessorKey: "specialite" },
];

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState<Partial<Professor>>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfessors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProfessors();
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfessors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProfessor({
      ...currentProfessor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedProfessor = await updateProfessor(
        currentProfessor.id!,
        currentProfessor
      );
      setProfessors(
        professors.map((p) =>
          p.id === updatedProfessor.id ? updatedProfessor : p
        )
      );
    } else {
      const newProfessor = await createProfessor(currentProfessor);
      setProfessors([...professors, newProfessor]);
    }
    setIsDialogOpen(false);
    setCurrentProfessor({});
    setIsEditing(false);
  };

  const handleEdit = (professor: Professor) => {
    setCurrentProfessor(professor);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: keyof Professor) => {
    await deleteProfessor(Number(id));
    setProfessors(professors.filter((p) => p.id !== Number(id)));
  };

  if (isLoading) {
    return <div>Chargement des professeurs...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Professeurs
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentProfessor({});
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z">ajouter un prof</path></svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Modifier le professeur"
                  : "Ajouter un nouveau professeur"}
              </DialogTitle>
            </DialogHeader>
            <ProfessorForm
              professor={currentProfessor}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Professor>
        entityName="Professeurs"
        columns={columns}
        items={professors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  );
}

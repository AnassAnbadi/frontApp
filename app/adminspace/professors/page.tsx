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
          p.id === updatedProfessor.code ? updatedProfessor : p
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
              Ajouter un professeur
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

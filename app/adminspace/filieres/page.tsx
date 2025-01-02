"use client";

import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/EntityCrud";
import { FiliereForm } from "@/components/FiliereForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filiere } from "@/types";
import {
  fetchFilieres,
  createFiliere,
  updateFiliere,
  deleteFiliere,
} from "@/utils/filiereAPI";

const columns: { header: string; accessorKey: keyof Filiere }[] = [
  { header: "id", accessorKey: "id" },
  { header: "Nom de la Filière", accessorKey: "nomFiliere" },
];

export default function FilieresPage() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFiliere, setCurrentFiliere] = useState<Partial<Filiere>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadFilieres = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFilieres();
        setFilieres(data);
      } catch (error) {
        console.error("Error fetching filieres:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFilieres();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFiliere({
      ...currentFiliere,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedFiliere = await updateFiliere(currentFiliere.id!, currentFiliere);
      setFilieres(
        filieres.map((f) =>
          f.id === updatedFiliere.id ? updatedFiliere : f
        )
      );
    } else {
      const newFiliere = await createFiliere(currentFiliere);
      setFilieres([...filieres, newFiliere]);
    }
    setIsDialogOpen(false);
    setCurrentFiliere({});
    setIsEditing(false);
  };

  const handleEdit = (filiere: Filiere) => {
    setCurrentFiliere(filiere);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: keyof Filiere) => {
    await deleteFiliere(Number(id));
    setFilieres(filieres.filter((f) => f.id !== Number(id)));
  };

  if (isLoading) {
    return <div>Chargement des filières...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Filières
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentFiliere({});
              }}
            >
              Ajouter une filière
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Modifier la filière"
                  : "Ajouter une nouvelle filière"}
              </DialogTitle>
            </DialogHeader>
            <FiliereForm
              filiere={currentFiliere}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Filiere>
        entityName="Filières"
        columns={columns}
        items={filieres}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  );
}

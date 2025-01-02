"use client";

import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/EntityCrud";
import { SemestreForm } from "@/components/SemestreForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Semestre } from "@/types";
import {
  fetchSemestres,
  createSemestre,
  updateSemestre,
  deleteSemestre,
} from "@/utils/SemestreAPI";

const columns: { header: string; accessorKey: keyof Semestre }[] = [
  { header: "id", accessorKey: "id" },
  { header: "Nom du Semestre", accessorKey: "nom" },
];

export default function SemestresPage() {
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSemestre, setCurrentSemestre] = useState<Partial<Semestre>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadSemestres = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSemestres();
        setSemestres(data);
      } catch (error) {
        console.error("Error fetching semestres:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSemestres();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSemestre({
      ...currentSemestre,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedSemestre = await updateSemestre(
        currentSemestre.id!,
        currentSemestre
      );
      setSemestres(
        semestres.map((s) =>
          s.id === updatedSemestre.id ? updatedSemestre : s
        )
      );
    } else {
      const newSemestre = await createSemestre(currentSemestre);
      console.log(newSemestre,"anass")
      setSemestres([...semestres, newSemestre]);
    }
    setIsDialogOpen(false);
    setCurrentSemestre({});
    setIsEditing(false);
  };

  const handleEdit = (semestre: Semestre) => {
    setCurrentSemestre(semestre);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: keyof Semestre) => {
    await deleteSemestre(Number(id));
    setSemestres(semestres.filter((s) => s.id !== Number(id)));
  };

  if (isLoading) {
    return <div>Chargement des semestres...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Semestres
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentSemestre({});
              }}
            >
              Ajouter un semestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Modifier le semestre"
                  : "Ajouter un nouveau semestre"}
              </DialogTitle>
            </DialogHeader>
            <SemestreForm
              semestre={currentSemestre}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Semestre>
        entityName="Semestres"
        columns={columns}
        items={semestres}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  );
}

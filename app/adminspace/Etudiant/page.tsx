"use client";

import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/EntityCrud";
import { EtudiantForm } from "@/components/EtudiantForm"; // Nouveau formulaire pour les étudiants
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filiere, Semestre, Etudiant } from "@/types";
import {
  fetchEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "@/utils/EtudiantAPI";
import { fetchFilieres } from "@/utils/filiereAPI";
import { fetchSemestres } from "@/utils/SemestreAPI";

const columns: { header: string; accessorKey: keyof Etudiant }[] = [
  { header: "id", accessorKey: "id" },
  { header: "Nom de l'Étudiant", accessorKey: "nomEtudiant" },
  { header: "Prénom de l'Étudiant", accessorKey: "prenomEtudiant" },
  { header: "Filière", accessorKey: "nomFiliere" },
  { header: "Semestre", accessorKey: "nom" },
];

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEtudiant, setCurrentEtudiant] = useState<Partial<Etudiant>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Récupérer les étudiants, les filières et les semestres
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [etudiantData, filiereData, semestreData] = await Promise.all([
          fetchEtudiants(),
          fetchFilieres(),
          fetchSemestres(),
        ]);
        setEtudiants(etudiantData);
        setFilieres(filiereData);
        console.log(filiereData,"filiere");
        console.log(semestreData,"semes");
        setSemestres(semestreData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEtudiant({
      ...currentEtudiant,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: String, type: string) => {
    if (type === "filiere") {
      setCurrentEtudiant({
        ...currentEtudiant,
        nomFiliere: filieres.find(f => f.id === Number(e))?.nomFiliere,
      });
      console.log(currentEtudiant,"Current");
    } else if (type === "semestre") {
      setCurrentEtudiant({
        ...currentEtudiant,
        nom: semestres.find(s => s.id === Number(e))?.nom,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedEtudiant = await updateEtudiant(currentEtudiant.id!, currentEtudiant);
      setEtudiants(
        etudiants.map((e) =>
          e.id === updatedEtudiant.id ? updatedEtudiant : e
        )
      );
    } else {
      const newEtudiant = await createEtudiant(currentEtudiant);
      console.log(currentEtudiant);
      setEtudiants([...etudiants, newEtudiant]);
    }
    setIsDialogOpen(false);
    setCurrentEtudiant({});
    setIsEditing(false);
  };

  const handleEdit = (etudiant: Etudiant) => {
    setCurrentEtudiant(etudiant);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: keyof Etudiant) => {
    await deleteEtudiant(Number(id));
    setEtudiants(etudiants.filter((e) => e.id !== Number(id)));
  };

  if (isLoading) {
    return <div>Chargement des étudiants...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Étudiants
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentEtudiant({});
              }}
            >
              Ajouter un étudiant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier l'étudiant" : "Ajouter un étudiant"}
              </DialogTitle>
            </DialogHeader>
            <EtudiantForm
              etudiant={currentEtudiant}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange} // Passer la méthode de sélection ici
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Etudiant>
        entityName="Étudiants"
        columns={columns}
        items={etudiants}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  );
}

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
  { header: "Semestre", accessorKey: "nomSemestre" },
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
        console.log(filiereData,"etudiant");
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    if (type === "filiere") {
      setCurrentEtudiant({
        ...currentEtudiant,
        nomFiliere: filieres.find(f => f.nomFiliere === e.target.value)?.nomFiliere,
      });
      console.log(currentEtudiant,"Current");
    } else if (type === "semestre") {
      setCurrentEtudiant({
        ...currentEtudiant,
        nomSemestre: semestres.find(s => s.nom === e.target.value)?.nom,
      });
      console.log(currentEtudiant,"pour Semetre");
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
      console.log(currentEtudiant,);
      const newEtudiant = await createEtudiant(currentEtudiant);
      console.log(newEtudiant,"pour ajouter");
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path></svg>
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

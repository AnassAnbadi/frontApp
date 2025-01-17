import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etudiant, Filiere, Semestre } from "@/types";
import { fetchFilieres } from "@/utils/filiereAPI";
import { fetchSemestres } from "@/utils/SemestreAPI";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EtudiantFormProps {
  etudiant: Partial<Etudiant>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, type: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EtudiantForm({
  etudiant,
  isEditing,
  onInputChange,
  onSelectChange,
  onSubmit,
}: EtudiantFormProps) {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<string | undefined>(
    etudiant.nomFiliere
  );
  const [selectedSemestre, setSelectedSemestre] = useState<string | undefined>(
    etudiant.nomSemestre
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [filieresData, semestresData] = await Promise.all([
          fetchFilieres(),
          fetchSemestres(),
        ]);
        
        if (Array.isArray(filieresData)) {
          setFilieres(filieresData);
        } else {
          console.error("Filieres data is not an array:", filieresData);
          setFilieres([]);
        }

        if (Array.isArray(semestresData)) {
          setSemestres(semestresData);
        } else {
          console.error("Semestres data is not an array:", semestresData);
          setSemestres([]);
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        setError("Erreur lors du chargement des données");
      }
    };

    loadData();
  }, []);

  const handleFiliereChange = (value: string) => {
    setSelectedFiliere(value);
    const fakeEvent = {
      target: {
        name: "nomFiliere",
        value: value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onSelectChange(fakeEvent, "filiere");
  };

  const handleSemestreChange = (value: string) => {
    setSelectedSemestre(value);
    const fakeEvent = {
      target: {
        name: "nom",
        value: value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onSelectChange(fakeEvent, "semestre");
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nomEtudiant">Nom</Label>
        <Input
          id="nomEtudiant"
          name="nomEtudiant"
          value={etudiant.nomEtudiant || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="prenomEtudiant">Prénom</Label>
        <Input
          id="prenomEtudiant"
          name="prenomEtudiant"
          value={etudiant.prenomEtudiant || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="nomFiliere">Filière</Label>
        <Select
          value={selectedFiliere || ""}
          onValueChange={handleFiliereChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une filière" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filières</SelectLabel>
              {filieres.map((filiere) => (
                <SelectItem key={filiere.id} value={filiere.nomFiliere}>
                  {filiere.nomFiliere}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="nomSemetre">Semestre</Label>
        <Select
          value={selectedSemestre || ""}
          onValueChange={handleSemestreChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semestres</SelectLabel>
              {semestres.map((semestre) => (
                <SelectItem key={semestre.id} value={semestre.nom}>
                  {semestre.nom}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
    </form>
  );
}


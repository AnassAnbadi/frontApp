import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etudiant, Filiere, Semestre } from "@/types"; // Importer les types
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
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>,type: string) => void;
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
  const [selectedFiliere, setSelectedFiliere] = useState<string | undefined>(etudiant.nomFiliere);
  const [selectedSemestre, setSelectedSemestre] = useState<string | undefined>(etudiant.nom);
  
  useEffect(() => {
    // Fetch filières when the form loads
    const loadFilieres = async () => {
      try {
        const data = await fetchFilieres();
        setFilieres(data);
      } catch (error) {
        console.error("Error fetching filieres:", error);
      }
    };

    loadFilieres();
  }, []);

  // Fetch semestres when a filière is selected
  useEffect(() => {
      const loadSemestres = async () => {
        try {
          const data = await fetchSemestres();
          console.log(data);
          setSemestres(data);
        } catch (error) {
          console.error("Error fetching semestres:", error);
        }
      };

      loadSemestres();
  }, []);

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
      onValueChange={(value) => {
        setSelectedFiliere(value);
        const fakeEvent = {
          target: {
            name: "nomFiliere",
            value: value,
          },
        } as React.ChangeEvent<HTMLSelectElement>;
    
        onSelectChange(fakeEvent, "filiere");    
        
      }}
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
  onValueChange={(value) => {
    setSelectedSemestre(value);

    // Crée un événement factice
    const fakeEvent = {
      target: {
        name: "nomSemetre",
        value: value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onSelectChange(fakeEvent, "semestre");
  }}
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

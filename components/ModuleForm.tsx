import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Module, Filiere, Semestre } from "@/types";
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

interface ModuleFormProps {
  module: Partial<Module>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (type: string, value: Filiere | Semestre) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ModuleForm({
  module,
  isEditing,
  onInputChange,
  onSelectChange,
  onSubmit,
}: ModuleFormProps) {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nomModule">Nom du Module</Label>
        <Input
          id="nomModule"
          name="nomModule"
          value={module.nomModule || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="filiere">Filière</Label>
        <Select
          value={module.filiere?.id.toString()}
          onValueChange={(value) => {
            const filiere = filieres.find(f => f.id.toString() === value);
            if (filiere) {
              onSelectChange("filiere", filiere);
              console.log(filiere,"mal hadi katmchi khawya");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une filière" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filières</SelectLabel>
              {filieres.map((filiere) => (
                <SelectItem key={filiere.id} value={filiere.id.toString()}>
                  {filiere.nomFiliere}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="semestre">Semestre</Label>
        <Select
          value={module.semestre?.id.toString()}
          onValueChange={(value) => {
            const semestre = semestres.find(s => s.id.toString() === value);
            if (semestre) {
              onSelectChange("semestre", semestre);
              console.log(semestre,"et pour semestre");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semestres</SelectLabel>
              {semestres.map((semestre) => (
                <SelectItem key={semestre.id} value={semestre.id.toString()}>
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


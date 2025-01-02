import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filiere } from "@/types";

interface FiliereFormProps {
  filiere: Partial<Filiere>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function FiliereForm({
  filiere,
  isEditing,
  onInputChange,
  onSubmit,
}: FiliereFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nomFiliere">Nom de la filière</Label>
        <Input
          id="nomFiliere"
          name="nomFiliere"
          value={filiere.nomFiliere || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
    </form>
  );
}

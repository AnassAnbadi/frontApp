import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Semestre } from "@/types";

interface SemestreFormProps {
  semestre: Partial<Semestre>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SemestreForm({
  semestre,
  isEditing,
  onInputChange,
  onSubmit,
}: SemestreFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de la semestre</Label>
        <Input
          id="nom"
          name="nom"
          value={semestre.nom || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
    </form>
  );
}

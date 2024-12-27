import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Professor } from "@/types";

interface ProfessorFormProps {
  professor: Partial<Professor>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfessorForm({
  professor,
  isEditing,
  onInputChange,
  onSubmit,
}: ProfessorFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          name="nom"
          value={professor.nom || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          name="prenom"
          value={professor.prenom || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          name="username"
          value={professor.username || ""}
          onChange={onInputChange}
          required
        />
      </div>
      {!isEditing && (
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={professor.password || ""}
            onChange={onInputChange}
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="specialite">Spécialité</Label>
        <Input
          id="specialite"
          name="specialite"
          value={professor.specialite || ""}
          onChange={onInputChange}
          required
        />
      </div>
      <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
    </form>
  );
}

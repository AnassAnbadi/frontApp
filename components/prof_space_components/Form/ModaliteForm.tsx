import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ModaliteEvaluation,
  ModaliteEvaluationPost,
  ModeEvaluation,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import { Value } from "@radix-ui/react-select";

interface ModeEvaluationFormProps {
  isEditing: boolean;
  modeEvaluation?: ModeEvaluation;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onModaliteChange: (
    index: number,
    field: keyof ModaliteEvaluationPost,
    value: string
  ) => void;
  onAddModaliteFields: () => void;
}

export function ModeEvaluationForm({
  isEditing,
  modeEvaluation,
  onSubmit,
  onInputChange,
  onModaliteChange,
  onAddModaliteFields,
}: ModeEvaluationFormProps) {
  const [modalitesVisible, setModalitesVisible] = useState(false);

  const handleSetModaliteFields = () => {
    onAddModaliteFields();
    setModalitesVisible(true); // This will show the modalite fields
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (modeEvaluation) onSubmit(e);
      }}
      className="space-y-4 overflow-y-auto max-h-[500px]"
    >
      {!modalitesVisible && (
        <div>
          <div>
            <Label htmlFor="initialField">Number of Modalite Fields</Label>
            <Input
              id="initialField"
              name="initialField"
              type="number"
              value={modeEvaluation?.initialField}
              onChange={onInputChange}
              required
            />
          </div>
          <Button type="button" onClick={handleSetModaliteFields}>
            Set Modalite Fields
          </Button>
        </div>
      )}

      {modalitesVisible &&
        modeEvaluation?.modalites.map((modalite, index) => (
          <div key={index}>
            <Label htmlFor={`modalite-${index}`}>Modalite {index + 1}</Label>
            <Input
              id={`modalite-${index}`}
              name={`modalite-${index}`}
              value={modalite.coefficient}
              onChange={(e) =>
                onModaliteChange(index, "coefficient", e.target.value)
              }
              required
            />
            <Label htmlFor={`typeModalite-${index}`}>
              Type Modalite {index + 1}
            </Label>
            <div id={`modalite-${index}`}></div>
            <Select
              name={`modalite-${index}`}
              value={modalite.typeModalite}
              onValueChange={(value) =>
                onModaliteChange(index, "typeModalite", value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC">CC</SelectItem>
                <SelectItem value="Projet">Projet</SelectItem>
                <SelectItem value="Presentation">Presentation</SelectItem>
                <SelectItem value="TP">TP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}

      {modalitesVisible && (
        <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
      )}
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
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
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import {
  ModaliteEvaluation,
  ModaliteEvaluationPost,
  ModeEvaluation,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";

interface ModeEvaluationFormProps {
  isEditing: boolean;
  modeEvaluation: ModeEvaluation;
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
  onDeleteModalite: (index: number) => void;
}

export function ModeEvaluationForm({
  isEditing,
  modeEvaluation,
  onSubmit,
  onInputChange,
  onModaliteChange,
  onAddModaliteFields,
  onDeleteModalite,
}: ModeEvaluationFormProps) {
  const [modalitesVisible, setModalitesVisible] = useState(false);

  const handleSetModaliteFields = () => {
    onAddModaliteFields();
    setModalitesVisible(true);
  };

  useEffect(() => {
    if (isEditing && modeEvaluation && modeEvaluation.modalites.length > 0) {
      setModalitesVisible(true);
    }
  }, [isEditing, modeEvaluation]);

  const calculateCoefficientSum = () =>
    modeEvaluation.modalites.reduce(
      (sum, modalite) => sum + parseFloat(modalite.coefficient || "0"),
      0
    );

  const isCoefficientValid = Math.abs(calculateCoefficientSum() - 1) < 0.001;

  const areModaliteTypesUnique =
    new Set(modeEvaluation.modalites.map((modalite) => modalite.typeModalite))
      .size === modeEvaluation.modalites.length;

  const canSubmit =
    isCoefficientValid &&
    areModaliteTypesUnique &&
    modeEvaluation.modalites.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isCoefficientValid) onSubmit(e);
      }}
      className="space-y-4"
    >
      {!modalitesVisible && !isEditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="initialField">
                  Number of Modalite Fields (Max 4)
                </Label>
                <Input
                  id="initialField"
                  name="initialField"
                  type="number"
                  min="1"
                  max="4"
                  value={modeEvaluation.initialField}
                  onInput={(e) => {
                    const value = Math.max(
                      1,
                      Math.min(
                        4,
                        parseInt((e.target as HTMLInputElement).value, 10) || 1
                      )
                    );
                  }}
                  onChange={onInputChange}
                  required
                />
              </div>
              <Button type="button" onClick={handleSetModaliteFields}>
                Set Modalite Fields
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(modalitesVisible || isEditing) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {modeEvaluation.modalites.map((modalite, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`modalite-${index}`}>
                      Modalite {index + 1}
                    </Label>
                    <Button
                      type="button"
                      disabled={modalite.isvalidate}
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteModalite(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`coefficient-${index}`}>
                        Coefficient
                      </Label>
                      <Input
                        id={`coefficient-${index}`}
                        value={modalite.coefficient || "0"}
                        disabled={modalite.isvalidate}
                        onChange={(e) =>
                          onModaliteChange(index, "coefficient", e.target.value)
                        }
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`typeModalite-${index}`}>
                        Type Modalite
                      </Label>
                      <Select
                        disabled={modalite.isvalidate}
                        value={modalite.typeModalite}
                        onValueChange={(value) =>
                          onModaliteChange(index, "typeModalite", value)
                        }
                        required
                      >
                        <SelectTrigger id={`typeModalite-${index}`}>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">CC</SelectItem>
                          <SelectItem value="Projet">Projet</SelectItem>
                          <SelectItem value="Presentation">
                            Presentation
                          </SelectItem>
                          <SelectItem value="TP">TP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {modeEvaluation.modalites.length > 0 && (
                <p
                  className={
                    isCoefficientValid ? "text-green-500" : "text-red-500"
                  }
                >
                  Somme des coefficients: {calculateCoefficientSum().toFixed(2)}
                  {isCoefficientValid ? " (Valide)" : " (Doit être égale à 1)"}
                </p>
              )}
              {modeEvaluation.modalites.length < 4 && (
                <Button type="button" onClick={onAddModaliteFields}>
                  Add Modalite
                </Button>
              )}
              <Button type="submit" disabled={!isCoefficientValid}>
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

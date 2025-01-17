"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ModaliteEvaluationForElemet,
  Column,
  ModaliteEvaluation,
  ModeEvaluation,
  ModaliteEvaluationPost,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import { ModeEvaluationForm } from "@/components/prof_space_components/Form/ModaliteForm";
import {
  fetchModaliteEvaluations,
  createModaliteEvaluation,
  updateModaliteEvaluation,
} from "@/components/prof_space_components/Crud_backend/api_amplimentation/element_api";
import { Button } from "@/components/ui/button";
import { EntityCrud } from "@/components/prof_space_components/Crud_backend/Crud/EvaluationCrud";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const columns: Column<ModaliteEvaluationForElemet>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Type Modalite", accessorKey: "typeModalite" },
  { header: "Coefficient", accessorKey: "coefficient" },
  { header: "Element", accessorKey: "Element" },
];

export default function EvaluationPage() {
  const [modaliteEvaluations, setModaliteEvaluations] = useState<
    ModaliteEvaluationForElemet[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modeEvaluation, setModeEvaluation] = useState<ModeEvaluation>({
    initialField: "",
    modalites: [],
  });
  const router = useRouter();

  const [currentElement, setCurrentElement] = useState<number | null>(null);

  useEffect(() => {
    const storedCurrentModule = sessionStorage.getItem("currentModule");
    if (storedCurrentModule) {
      setCurrentElement(parseInt(storedCurrentModule));
    }
  }, []);

  useEffect(() => {
    const loadModaliteEvaluations = async () => {
      if (currentElement === null) return;
      setIsLoading(true);
      try {
        const data = await fetchModaliteEvaluations(currentElement);
        setModaliteEvaluations(data);
      } catch (error) {
        console.error("Error fetching modalite evaluations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModaliteEvaluations();
  }, [currentElement]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setModeEvaluation((prev) => ({
      ...prev,
      [name]: name === "initialField" ? parseInt(value) : value,
    }));
  };

  const handleModaliteChange = (
    index: number,
    field: keyof ModaliteEvaluation,
    value: string
  ) => {
    const newModalites = [...modeEvaluation.modalites];
    newModalites[index] = {
      ...newModalites[index],
      [field]: value,
    };
    setModeEvaluation((prev) => ({
      ...prev,
      modalites: newModalites,
    }));
  };

  const handleAddModaliteFields = () => {
    const newModalites = Array(Number(modeEvaluation.initialField)).fill({
      coefficient: "",
      typeModalite: "",
    });
    setModeEvaluation((prev) => ({
      ...prev,
      modalites: newModalites,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Mettre à jour une modalité existante
        const updatedEvaluations = await updateModaliteEvaluation(
          currentElement as number,
          modeEvaluation.modalites
        );

        setModaliteEvaluations((prev) =>
          prev.map((evaluation) =>
            evaluation.id === updatedEvaluations[0]?.id
              ? updatedEvaluations[0]
              : evaluation
          )
        );
      } else {
        // Créer une nouvelle modalité
        console.log("modeEvaluation.modalites", modeEvaluation.modalites);
        const newEvaluations = await createModaliteEvaluation(
          modeEvaluation.modalites
        );
        setModaliteEvaluations((prev) => [...prev, ...newEvaluations]);
      }

      // Réinitialiser l'état
      setIsDialogOpen(false);
      setModeEvaluation({
        initialField: "",
        modalites: [
          {
            typeModalite: "",
            coefficient: "",
          },
        ],
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting modalite evaluation:", error);
    }
  };

  const handleShowElement = async (id: keyof ModaliteEvaluationForElemet) => {
    sessionStorage.setItem("currentModaliteEvaluation", id.toString());
    router.push("/profspace/elements");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Modalités d'évaluation
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button onClick={() => setIsDialogOpen(true)}>
              Ajouter Modalité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Modifier la modalité"
                  : "Ajouter une nouvelle modalité"}
              </DialogTitle>
            </DialogHeader>
            <ModeEvaluationForm
              isEditing={isEditing}
              modeEvaluation={modeEvaluation}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
              onModaliteChange={handleModaliteChange}
              onAddModaliteFields={handleAddModaliteFields}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<ModaliteEvaluationForElemet>
        entityName="Modalite Evaluations"
        columns={columns}
        items={modaliteEvaluations}
        onShowDetaile={handleShowElement}
        primaryKey="id"
      />
    </div>
  );
}

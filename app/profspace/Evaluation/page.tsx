"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ModaliteEvaluationForElement,
  Column,
  ModaliteEvaluation,
  ModeEvaluation,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import { ModeEvaluationForm } from "@/components/prof_space_components/Form/Form";
import {
  fetchModaliteEvaluations,
  createModaliteEvaluation,
  updateModaliteEvaluation,
  deleteModalite,
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

const columns: Column<ModaliteEvaluationForElement>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Type Modalite", accessorKey: "typeModalite" },
  { header: "Coefficient", accessorKey: "coefficient" },
  { header: "Valide", accessorKey: "isvalidate" },
  { header: "Element", accessorKey: "nomElement" },
  { header: "Module", accessorKey: "nomModule" },
  { header: "Filiere", accessorKey: "nomFiliere" },
  { header: "Semestre", accessorKey: "nomSemestre" },
];

export default function EvaluationPage() {
  const [modaliteEvaluations, setModaliteEvaluations] = useState<
    ModaliteEvaluationForElement[]
  >([]);
  const [isModalitesAdded, setIsModalitesAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modeEvaluation, setModeEvaluation] = useState<ModeEvaluation>({
    initialField: "",
    modalites: [],
  });
  const [modaliteIds, setModaliteIds] = useState<number[]>([]);
  const router = useRouter();

  const [currentElement, setCurrentElement] = useState<number | null>(null);

  useEffect(() => {
    const storedCurrentElement = sessionStorage.getItem("currentElement");
    if (storedCurrentElement) {
      setCurrentElement(parseInt(storedCurrentElement));
    }
  }, []);

  const loadModaliteEvaluations = useCallback(async () => {
    if (currentElement === null) return;
    setIsLoading(true);
    try {
      const data = await fetchModaliteEvaluations(currentElement);
      setIsModalitesAdded(data.length > 0);
      setIsEditing(data.length > 0);
      const mappedData = data.map((item: ModaliteEvaluationForElement) => ({
        ...item,
        isvalidate: item.isvalidate ? "Valide" : "Non Valide",
      }));
      setModaliteEvaluations(mappedData);
      setModeEvaluation({
        initialField: data.length.toString(),
        modalites: data.map((item: ModaliteEvaluation) => ({
          typeModalite: item.typeModalite,
          coefficient: item.coefficient,
          isvalidate: item.isvalidate,
        })),
      });
      setModaliteIds(data.map((item: ModaliteEvaluationForElement) => item.id));
    } catch (error) {
      console.error("Error fetching modalite evaluations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentElement]);

  useEffect(() => {
    loadModaliteEvaluations();
  }, [loadModaliteEvaluations]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setModeEvaluation((prev) => ({
        ...prev,
        [name]: name === "initialField" ? parseInt(value) : value,
      }));
    },
    []
  );

  const handleModaliteChange = useCallback(
    (
      index: number,
      field: keyof ModaliteEvaluation,
      value: string | number
    ) => {
      setModeEvaluation((prev) => {
        const newModalites = [...prev.modalites];
        newModalites[index] = {
          ...newModalites[index],
          [field]: value,
        };
        return { ...prev, modalites: newModalites };
      });
    },
    []
  );

  const handleAddModaliteFields = useCallback(() => {
    setModeEvaluation((prev) => {
      if (prev.modalites.length == 0) {
        const newModalites = Array(Number(prev.initialField)).fill({
          coefficient: "",
          typeModalite: "",
          isvalidate: false,
        });
        return { ...prev, modalites: newModalites };
      } else if (prev.modalites.length < 4) {
        return {
          ...prev,
          modalites: [
            ...prev.modalites,
            { coefficient: "", typeModalite: "", isvalidate: false },
          ],
        };
      }
      return prev;
    });
  }, []);

  const handleDeleteModalite = useCallback(async (index: number) => {
    setModeEvaluation((prev) => ({
      ...prev,
      modalites: prev.modalites.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentElement) {
        alert("Current element is not selected.");
        return;
      }

      try {
        let updatedEvaluations;
        if (isEditing) {
          console.log(currentElement, modeEvaluation.modalites);
          updatedEvaluations = await updateModaliteEvaluation(
            currentElement,
            modeEvaluation.modalites.map((modalite) => ({
              ...modalite,
              isvalidate: false,
            })),
            modaliteIds
          );
        } else {
          updatedEvaluations = await createModaliteEvaluation(
            currentElement,
            modeEvaluation.modalites.map((modalite) => ({
              ...modalite,
              isvalidate: false,
            }))
          );
        }
        console.log("Updated evaluations:", updatedEvaluations);
        await loadModaliteEvaluations();
        resetFormState();
      } catch (error) {
        console.error("Error submitting modalite evaluation:", error);
      }
    },
    [
      currentElement,
      isEditing,
      modeEvaluation.modalites,
      loadModaliteEvaluations,
    ]
  );

  const resetFormState = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const onCancel = useCallback(async () => {
    if (currentElement === null) return;
    const data = await fetchModaliteEvaluations(currentElement);
    setIsModalitesAdded(data.length > 0);
    setIsEditing(data.length > 0);
    setModeEvaluation({
      initialField: data.length.toString(),
      modalites: data.map((item: ModaliteEvaluation) => ({
        typeModalite: item.typeModalite,
        coefficient: item.coefficient,
        isvalidate: item.isvalidate,
      })),
    });
    setModaliteIds(data.map((item: ModaliteEvaluationForElement) => item.id));
  }, [modaliteEvaluations]);

  const handleShowElement = useCallback(
    async (
      id: keyof ModaliteEvaluationForElement,
      isvalid: keyof ModaliteEvaluationForElement
    ) => {
      sessionStorage.setItem("currentModaliteEvaluation", id.toString());
      sessionStorage.setItem("isvalid", isvalid.toString());
      router.push("/profspace/Note");
    },
    [router]
  );

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
            <Button
              onClick={async () => {
                await onCancel();
                setIsDialogOpen(true);
              }}
            >
              {isModalitesAdded ? "Modifier Modalités" : "Ajouter Modalité"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Modifier la modalité"
                  : isModalitesAdded
                  ? "Modifier les modalités existantes"
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
              onDeleteModalite={handleDeleteModalite}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<ModaliteEvaluationForElement>
        entityName="Modalite Evaluations"
        columns={columns}
        items={modaliteEvaluations}
        onShowDetaile={handleShowElement}
        primaryKey="id"
      />
    </div>
  );
}

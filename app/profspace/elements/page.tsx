"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/prof_space_components/Crud_backend/Crud/elemenCrud";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ElementForProf,
  ProfessorLogin,
  Column,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import { fetchelementforProf } from "@/components/prof_space_components/Crud_backend/api_amplimentation/element_api";

const columns: Column<ElementForProf>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Nom Element", accessorKey: "nomElement" },
  { header: "Coefficient", accessorKey: "coefficient" },
  { header: "Module", accessorKey: "moduleName" },
  { header: "Filiere", accessorKey: "filiereName" },
  { header: "Semestre", accessorKey: "semestreName" },
];

export default function ElementsPage() {
  const [profData, setProfData] = useState<ProfessorLogin | null>(null);
  useEffect(() => {
    const storedProfData = sessionStorage.getItem("profData");
    console.log("Stored Prof Data:", storedProfData); // Logs the raw session storage value
    if (storedProfData) {
      setProfData(JSON.parse(storedProfData));
    }
  }, []);

  useEffect(() => {
    if (profData) {
      console.log("Updated Prof Data:", profData); // Logs the updated profData
    }
  }, [profData]);

  const [elements, setElements] = useState<ElementForProf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState<Partial<ElementForProf>>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const loadElements = async () => {
      if (!profData) return; // Ensure profData is available
      console.log("Loading elements for profData:", profData);
      setIsLoading(true);
      try {
        const data = await fetchelementforProf(profData.id);
        setElements(data);
      } catch (error) {
        console.error("Error fetching elements:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadElements();
  }, [profData]); // Runs when profData changes

  const handleManageGrade = async (id: keyof ElementForProf) => {
    sessionStorage.setItem("currentElement", id.toString());
    console.log("Manage grade for Elemet:", id);
    router.push("/profspace/Evaluation");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Elements
        </h1>
      </div>
      <EntityCrud<ElementForProf>
        entityName="Elements"
        columns={columns}
        items={elements}
        onManageGrade={handleManageGrade}
        primaryKey="id"
      />
    </div>
  );
}

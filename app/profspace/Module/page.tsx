"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { EntityCrud } from "@/components/prof_space_components/Crud_backend/Crud/moduleCrud";
import {
  ModuleForProf,
  ProfessorLogin,
  Column,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import { fetchModuleForProf } from "@/components/prof_space_components/Crud_backend/api_amplimentation/element_api";
import { Button } from "@/components/ui/button";

const columns: Column<ModuleForProf>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Nom Module", accessorKey: "nomModule" },
  { header: "Filiere", accessorKey: "filiereName" },
  { header: "Semestre", accessorKey: "semestreName" },
];

export default function ModulesPage() {
  const [profData, setProfData] = useState<ProfessorLogin | null>(null);
  const [modules, setModules] = useState<ModuleForProf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedProfData = sessionStorage.getItem("profData");
    console.log("Stored Prof Data:", storedProfData); // Logs the raw session storage value
    if (storedProfData) {
      setProfData(JSON.parse(storedProfData));
    }
  }, []);

  useEffect(() => {
    const loadModules = async () => {
      if (!profData) return; // Ensure profData is available
      console.log("Loading elements for profData:", profData);
      setIsLoading(true);
      try {
        const data = await fetchModuleForProf(profData.id);
        console.log("Fetched modules:", data);
        console.error("Error fetching modules:", data);
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModules();
  }, [profData]);

  const handleShowElement = async (id: keyof ModuleForProf) => {
    sessionStorage.setItem("currentModule", id.toString());
    console.log("Manage grade for module ID:", id);
    router.push("/profspace/elements");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Modules
        </h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Module</Button>
      </div>
      <EntityCrud<ModuleForProf>
        entityName="Modules"
        columns={columns}
        items={modules}
        onShowDetaile={handleShowElement}
        primaryKey="id"
      />
    </div>
  );
}

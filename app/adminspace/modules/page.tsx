"use client";

import { useState, useEffect } from "react";
import { EntityCrud } from "@/components/EntityCrud";
import { ModuleForm } from "@/components/ModuleForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filiere, Module, Semestre } from "@/types";
import {
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
} from "@/utils/ModuleAPI";

const columns = [
  { header: "ID", accessorKey: "id" as keyof Module },
  { header: "Nom du Module", accessorKey: "nomModule" as keyof Module },
  { 
    header: "Filière", 
    accessorKey: "filiere" as keyof Module,
    cell: (info: Module) => info.filiere?.nomFiliere 
  },
  { 
    header: "Semestre", 
    accessorKey: "semestre" as keyof Module,
    cell: (info: Module) => info.semestre?.nom 
  },
];

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const moduleData = await fetchModules();
        setModules(moduleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentModule({
      ...currentModule,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (type: string, value: Filiere | Semestre) => {
    setCurrentModule({
      ...currentModule,
      [type]: value,
    });
    console.log(currentModule,"on va verifier");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedModule = await updateModule(currentModule.id!, currentModule);
        setModules(
          modules.map((m) =>
            m.id === updatedModule.id ? updatedModule : m
          )
        );
      } else {
        const newModule = await createModule(currentModule);
        setModules([...modules, newModule]);
      }
      setIsDialogOpen(false);
      setCurrentModule({});
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  const handleEdit = (module: Module) => {
    setCurrentModule(module);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: keyof Module) => {
    try {
      await deleteModule(Number(id));
      setModules(modules.filter((m) => m.id !== Number(id)));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (isLoading) {
    return <div>Chargement des modules...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Modules
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentModule({});
              }}
            >
              Ajouter un module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier le module" : "Ajouter un nouveau module"}
              </DialogTitle>
            </DialogHeader>
            <ModuleForm
              module={currentModule}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
      <EntityCrud<Module>
        entityName="Modules"
        columns={columns}
        items={modules}
        onEdit={handleEdit}
        onDelete={handleDelete}
        primaryKey="id"
      />
    </div>
  );
}


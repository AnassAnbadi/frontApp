import { Module } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchModules = async () => {
  const response = await fetch(`${API_URL}/modules/get`);
  if (!response.ok) {
    throw new Error("Failed to fetch modules");
  }
  console.log(response.json,"3lach makatla3ch")
  return response.json();
};

export const createModule = async (module: Partial<Module>) => {
  const response = await fetch(`${API_URL}/modules/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...module,
      filiere_id: module.filiere?.id,
      semestre_id: module.semestre?.id
    }),
  });
  return response.json();
};

export const updateModule = async (id: number, module: Partial<Module>) => {
  const response = await fetch(`${API_URL}/modules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...module,
      filiere_id: module.filiere?.id,
      semestre_id: module.semestre?.id
    }),
  });
  return response.json();
};

export const deleteModule = async (id: number) => {
  await fetch(`${API_URL}/modules/${id}`, { method: "DELETE" });
};


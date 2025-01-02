import { Semestre } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchSemestres = async () => {
  const response = await fetch(`${API_URL}/semestres`);
  if (!response.ok) {
    throw new Error("Failed to fetch semestres");
  }
  console.log(response.json);
  return response.json();
};

export const createSemestre = async (semestre: Partial<Semestre>) => {
  const response = await fetch(`${API_URL}/semestres/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(semestre),
  });
  return response.json();
};

export const updateSemestre = async (id: number, semestre: Partial<Semestre>) => {
  const response = await fetch(`${API_URL}/semestres/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(semestre),
  });
  return response.json();
};

export const deleteSemestre = async (id: number) => {
  await fetch(`${API_URL}/semestres/${id}`, { method: "DELETE" });
};

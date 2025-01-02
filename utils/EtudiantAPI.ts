import { Etudiant, Filiere, Semestre } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchEtudiants = async () => {
  const response = await fetch(`${API_URL}/etudiants/dto`);
  if (!response.ok) {
    throw new Error("Failed to fetch etudiants");
  }
  return response.json();
};

export const createEtudiant = async (etudiant: Partial<Etudiant>) => {
  const response = await fetch(`${API_URL}/etudiants/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(etudiant),
  });
  return response.json();
};

export const updateEtudiant = async (id: number, etudiant: Partial<Etudiant>) => {
  const response = await fetch(`${API_URL}/etudiants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(etudiant),
  });
  return response.json();
};

export const deleteEtudiant = async (id: number) => {
  await fetch(`${API_URL}/etudiants/${id}`, { method: "DELETE" });
};

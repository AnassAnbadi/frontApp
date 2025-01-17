import { Filiere } from "@/types"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchFilieres = async () => {
  const response = await fetch(`${API_URL}/filieres`);
  if (!response.ok) {
    throw new Error("Failed to fetch filieres");
  }
  return response.json();
};

export const createFiliere = async (filiere: Partial<Filiere>) => {
  const response = await fetch(`${API_URL}/filieres/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filiere),
  });
  return response.json();
};

export const updateFiliere = async (id: number, filiere: Partial<Filiere>) => {
  const response = await fetch(`${API_URL}/filieres/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filiere),
  });
  return response.json();
};

export const deleteFiliere = async (id: number) => {
  await fetch(`${API_URL}/filieres/${id}`, { method: "DELETE" });
};

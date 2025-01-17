import { Semestre } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchSemestres = async () => {
  try {
    const response = await fetch(`${API_URL}/semestres`);
    if (!response.ok) {
      throw new Error("Failed to fetch semestres");
    }
    const text = await response.text(); // First get the response as text
    try {
      const data = JSON.parse(text); // Then try to parse it
      return data;
    } catch (e) {
      console.error("Invalid JSON response:", text);
      throw new Error("Invalid JSON response from server");
    }
  } catch (error) {
    console.error("Error in fetchSemestres:", error);
    throw error;
  }
};

export const createSemestre = async (semestre: Partial<Semestre>) => {
  try {
    const response = await fetch(`${API_URL}/semestres/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(semestre),
    });

    if (!response.ok) {
      // Lire le corps de la réponse pour obtenir plus de détails sur l'erreur
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.message || "Failed to create semestre");
    }

    // Retourner les données JSON si la requête a réussi
    return await response.json();
  } catch (error: any) {
    console.error("Error creating semestre:", error.message || error);
    throw error;
  }
};


export const updateSemestre = async (id: number, semestre: Partial<Semestre>) => {
  const response = await fetch(`${API_URL}/semestres/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(semestre),
  });
  if (!response.ok) {
    throw new Error("Failed to update semestre");
  }
  return response.json();
};

export const deleteSemestre = async (id: number) => {
  const response = await fetch(`${API_URL}/semestres/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete semestre");
  }
};


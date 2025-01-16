import {
  ModaliteEvaluationPost,
  Student,
  Note,
  NoteForPost,
} from "../DataTypes/Entity";
export const fetchelementforProf = async (id: number) => {
  const response = await fetch(
    `http://localhost:8080/api/elements/profElemnet/${id}`
  );
  console.log("fetch");
  if (!response.ok) {
    throw new Error("Failed to fetch professors");
  }
  return response.json();
};
export const fetchModaliteEvaluations = async (id: number) => {
  const response = await fetch(
    `http://localhost:8080/api/modalites/ForElement?elementId=${id}`
  );
  console.log("fetch");
  if (!response.ok) {
    throw new Error("Failed to fetch modalites");
  }
  return response.json();
};

export const createModaliteEvaluation = async (
  id: number,
  modalites: ModaliteEvaluationPost[]
) => {
  // Map modalites to include the element object with the id
  const payload = modalites.map((modalite) => ({
    ...modalite,
    element: { id }, // Add the element object with id
  }));

  // Send a POST request
  const response = await fetch(
    "http://localhost:8080/api/modalites/SaveAllModalite",
    {
      method: "POST", // Use POST method
      headers: {
        "Content-Type": "application/json", // Set headers for JSON
      },
      body: JSON.stringify(payload), // Convert payload to JSON string
    }
  );

  // Check for response status
  if (!response.ok) {
    throw new Error("Failed to save all modalites");
  }
  // Return the parsed JSON response
  return response.json();
};

export const updateModaliteEvaluation = async (
  elementId: number,
  modalites: ModaliteEvaluationPost[],
  modaliteIds: number[]
) => {
  const payload = modalites.map((modalite, index) => ({
    ...modalite,
    id: modaliteIds[index],
    element: { id: elementId },
  }));
  console.log("response", payload);
  const response = await fetch(
    "http://localhost:8080/api/modalites/UpdateAllModalite",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update modalites: ${response.statusText}`);
  }

  return response.json();
};

export const deleteModalite = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/modalites/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Return true if deletion was successful
    return true;
  } catch (error) {
    console.error("Failed to delete modalite:", error);
    throw error;
  }
};

export async function fetchStudents(idElement: number, idmodalite: number) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/etudiants/getStudentsByElement?elementId=${idElement}&modaliteId=${idmodalite}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch students for id ${idElement} status: ${response.status}`
      );
    }
    const data: Student[] = await response.json();
    console.log("Students fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export const SaveAllNote = async (notes: Note[]) => {
  // Send a POST request
  const response = await fetch("http://localhost:8080/api/notes/SaveAllNotes", {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Set headers for JSON
    },
    body: JSON.stringify(notes), // Convert payload to JSON string
  });

  // Check for response status
  if (!response.ok) {
    console.error("Failed to save all notes", response);
    throw new Error("Failed to save all modalites");
  }
  // Return the parsed JSON response
  return response.json();
};

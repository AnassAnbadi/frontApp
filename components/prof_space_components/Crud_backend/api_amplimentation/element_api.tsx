export const fetchelementforProf = async (id: number) => {
  const response = await fetch(
    `http://localhost:8080/elements/profElemnet/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch professors");
  }
  return response.json();
};

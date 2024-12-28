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

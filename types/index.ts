export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  password: string;
  image: string;
  specialite: string;
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
}

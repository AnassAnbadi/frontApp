export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  password: string;
  image: string;
  specialite: string;
}
export interface Filiere {
  id: number;
  nomFiliere: string;
}
export interface Semestre {
  id: number;
  nom: string;
}
export interface Etudiant {
  id: number;
  nomEtudiant: string;
  prenomEtudiant: string;
  nomFiliere: string;
  nom: string;
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
}

export interface Professor {
  code: number
  nom: string
  prenom: string
  nomUtilisateur: string
  motDePasse: string
  image: string
  specialite: string
}

export interface Column<T> {
  header: string
  accessorKey: keyof T
}


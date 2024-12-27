export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  nomUtilisateur: string;
  motDePasse: string;
  image: string;
  specialite: string;
}



export interface Module {
  id: number;
  nomModule: string;
  semestre: Semestre;
  filiere: Filiere;
  elements: Element[];
}

export interface NoteElement {
  id: number;
  element: Element;
  noteElement: number;
  modalite: ModaliteEvaluation;
  etudiant: Etudiant;
}

export interface Element {
  id: number;
  nomElement: string;
  coefficient: number;
  module: Module;
  professeur: Professor;
  notes: NoteElement[];
}

export interface Etudiant {
  id: number;
  nomEtudiant: string;
  prenomEtudiant: string;
  filiere: Filiere;
  semestre: Semestre;
  notes: NoteElement[];
}

export interface Filiere {
  id: number;
  nomFiliere: string;
  etudiants: Etudiant[];
  modules: Module[];
}

export interface ModaliteEvaluation {
  id: number;
  typeModalite: string;
  coefficient: number;
  notes: NoteElement[];
}

export interface Semestre {
  id: number;
  nom: string;
  modules: Module[];
  etudiants: Etudiant[];
}

export interface ElementForProf {
  id: number;
  nomElement: string;
  coefficient: number;
  moduleName: string;
  filiereName: string;
  semestreName: string;
}


export interface Column<T> {
  header: string;
  accessorKey: keyof T;
}
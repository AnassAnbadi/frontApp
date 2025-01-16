export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  nomUtilisateur: string;
  motDePasse: string;
  image: string;
  specialite: string;
}

export interface ProfessorLogin {
  id: number;
  nom: string;
  prenom: string;
  nomUtilisateur: string;
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
}

export interface Etudiant {
  id: string;
  nomEtudiant: string;
  prenomEtudiant: string;
  filiere: string;
  semestre: string;
}

export type Student = {
  id: number;
  name: string;
  lastName: string;
  grade: number | null;
  absent: boolean;
};

export interface Note {
  noteElement:string;
  absent:string;
  element:{id:string};
  modalite:{id:string};
  etudiant:{id:string};
}

export interface NoteForPost{
  Notes:Note[];
}

export interface Filiere {
  id: number;
  nomFiliere: string;
  etudiants: Etudiant[];
  modules: Module[];
}

export interface ModaliteEvaluation {
  typeModalite: string;
  coefficient: string;
  isvalidate: boolean;
}

export interface ModaliteEvaluationPost {
  typeModalite: string;
  coefficient: string;
  isvalidate: boolean;
};

export interface ModeEvaluation{
  initialField:string;
  modalites: ModaliteEvaluationPost[],
}

export interface ModaliteEvaluationForElement {
  id: number;               
  coefficient: number;      
  typeModalite: string; 
  isvalidate:boolean;    
  nomElement: string;       
  nomModule: string;        
  nomFiliere: string;       
  nomSemestre: string;      
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
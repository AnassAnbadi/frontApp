"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmModal } from "@/components/prof_space_components/confirm/confirm";
import { ConfirmALL } from "@/components/prof_space_components/confirm/confirmAllNote";
import {
  fetchStudents,
  SaveAllNote,
} from "@/components/prof_space_components/Crud_backend/api_amplimentation/element_api";
import {
  Student,
  Note,
  NoteForPost,
} from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";
import html2pdf from "html2pdf.js";

export default function GradeManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmALL, setShowConfirmALL] = useState(false);
  const [currentElement, setCurrentElement] = useState<number | null>(null);
  const [isvalid, setIsvalid] = useState<string | null>(null);
  const [currentModaliteEvaluation, setCurrentModaliteEvaluation] = useState<
    number | null
  >(null);
  const [msg, setMsg] = useState<string | null>("");
  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Prenom", accessorKey: "name" },
    { header: "Nom", accessorKey: "lastName" },
    { header: "Note", accessorKey: "grade" },
    { header: "Absent", accessorKey: "absent" },
  ];

  useEffect(() => {
    const storedCurrentElement = sessionStorage.getItem("currentElement");
    const storedcurrentModaliteEvaluation = sessionStorage.getItem(
      "currentModaliteEvaluation"
    );
    const storedIsvalid = sessionStorage.getItem("isvalid");
    if (storedCurrentElement) {
      setCurrentElement(parseInt(storedCurrentElement));
    }
    if (storedcurrentModaliteEvaluation) {
      setCurrentModaliteEvaluation(parseInt(storedcurrentModaliteEvaluation));
    }
    if (storedIsvalid) {
      setIsvalid(storedIsvalid);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    if (currentElement === null) return;
    if (currentModaliteEvaluation === null) return;
    console.log(
      "Loading students for element aa:",
      currentElement,
      currentModaliteEvaluation
    );
    try {
      setIsLoading(true);
      const data = await fetchStudents(
        currentElement,
        currentModaliteEvaluation
      );
      console.log("Data loaded:", data);
      if (isvalid === "Valide") {
        setIsValidating(true);
      }
      setStudents(data);
      console.log("Students loaded:", data);
    } catch (err) {
      setError("Failed to load students. Please try again later.");
      console.error("Failed to load students:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentElement]);

  useEffect(() => {
    console.log("Current element IS ss:", currentElement);
    loadStudents();
  }, [loadStudents]);

  const handleGradeChange = (id: number, value: string) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? {
              ...student,
              grade: value === "" ? null : Number(value),
              absent: false,
            }
          : student
      )
    );
  };

  const handleAbsentChange = (id: number, checked: boolean) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, absent: checked, grade: checked ? 0 : null }
          : student
      )
    );
  };

  const calculateAverage = () => {
    const validGrades = students
      .filter((s) => s.grade !== null)
      .map((s) => s.grade as number);
    return validGrades.length > 0
      ? validGrades.reduce((a, b) => a + b) / validGrades.length
      : 0;
  };

  const handleValidate = () => {
    const allGradesEntered = students.every(
      (s) => s.grade !== null || s.absent
    );
    const allGradesValid = students.every(
      (s) => s.grade === null || (s.grade >= 0 && s.grade <= 20)
    );
    const hasExtremeGrades = students.some(
      (s) => s.grade === 0 || s.grade === 20
    );

    if (!allGradesEntered || !allGradesValid) {
      setShowConfirmALL(true);
      setMsg(
        "Veuillez saisir toutes les notes valides (entre 0 et 20) ou marquer les étudiants comme absents."
      );
      return;
    }
    if (hasExtremeGrades) {
      setShowConfirmModal(true);
    } else {
      setIsValidating(true);
    }
  };

  const handleConfirmValidation = async () => {
    setShowConfirmModal(false);
    setIsValidating(true);

    // Here you would typically send the validated grades to the server
    // For now, we'll just simulate a delay

    // Here you would typically update the UI to show that grades are validated
  };

  const handleSaveDraft = async () => {
    console.log("Saving draft...,", currentElement, currentModaliteEvaluation);
    const allGradesEntered = students.every(
      (s) => s.grade !== null || s.absent
    );
    const allGradesValid = students.every(
      (s) => s.grade === null || (s.grade >= 0 && s.grade <= 20)
    );
    if (!allGradesEntered || !allGradesValid) {
      setShowConfirmALL(true);
      setMsg(
        "Veuillez saisir toutes les notes valides (entre 0 et 20) ou marquer les étudiants comme absents."
      );
      return;
    }

    const notesToSave: Note[] = students.map((student) => ({
      noteElement: student.grade?.toString() ?? "",
      absent: student.absent ? "1" : "0",
      element: { id: currentElement?.toString() ?? "" },
      modalite: { id: currentModaliteEvaluation?.toString() ?? "" },
      etudiant: { id: student.id.toString() },
    }));

    try {
      console.log("Saving draft...", notesToSave);
      const savedNotes = await SaveAllNote(notesToSave);
      console.log("Draft saved successfully", savedNotes);
      // Optionally, you can update the UI to show a success message
    } catch (error) {
      if (true) {
        setShowConfirmALL(true);
        setMsg(
          "Brouillon enregistré avec succès. Voulez-vous valider les notes maintenant?"
        );
        return;
      }
      console.error("Failed to save draft:", error);
      // Optionally, you can update the UI to show an error message
    }
  };

  const handleCancel = () => {
    // Implement cancellation logic
    console.log("Cancelling...");
  };

  const exportHtmlToPdfAttachment = useCallback(() => {
    const element = document.getElementById("grade-table");
    if (!element) return;

    // Add black color styling to the element
    element.style.color = "#000000"; // or just "black"

    const opt = {
      margin: 1,
      filename: "grade-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  }, []);

  const handleExport = () => {
    exportHtmlToPdfAttachment();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <table className="w-full" id="grade-table">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessorKey}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {student.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {student.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <Input
                  type="number"
                  value={student.grade === null ? "" : student.grade}
                  onChange={(e) =>
                    handleGradeChange(student.id, e.target.value)
                  }
                  disabled={student.absent || isValidating}
                  min={0}
                  max={20}
                  className="w-20"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <Checkbox
                  checked={student.absent}
                  onCheckedChange={(checked) =>
                    handleAbsentChange(student.id, checked as boolean)
                  }
                  disabled={isValidating}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <td
              colSpan={4}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Note
            </td>
            <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {calculateAverage().toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="px-6 py-4 space-x-2">
        <Button onClick={handleSaveDraft} disabled={isValidating}>
          Enregistrer en brouillon
        </Button>
        <Button onClick={handleCancel} disabled={isValidating}>
          Annuler
        </Button>
        <Button onClick={handleValidate} disabled={isValidating}>
          Valider
        </Button>
        <Button onClick={handleExport} disabled={!isValidating}>
          Exporter
        </Button>
      </div>

      <ConfirmALL
        isOpen={showConfirmALL}
        onClose={() => setShowConfirmALL(false)}
        errorMessage={msg ?? ""}
      />
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmValidation}
      />
    </div>
  );
}

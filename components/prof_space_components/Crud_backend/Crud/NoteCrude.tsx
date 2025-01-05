import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";

interface EntityCrudProps<T> {
  entityName: string;
  columns: Column<T>[];
  items: T[];
  onShowDetaile: (id: keyof T) => Promise<void>;
  primaryKey: keyof T;
  onSubmitGrades: (grades: { [key: string]: number }) => Promise<void>;
  onValidateModule: (moduleId: string) => Promise<void>;
  onSelectEvaluation: () => void;
}

export function EntityCrud<T extends { [key: string]: any }>({
  entityName,
  columns,
  items,
  onShowDetaile,
  primaryKey,
  onSubmitGrades,
  onValidateModule,
  onSelectEvaluation,
}: EntityCrudProps<T>) {
  const [grades, setGrades] = useState<{ [key: string]: number }>({});
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const handleGradeChange = (studentId: string, value: number) => {
    setGrades({
      ...grades,
      [studentId]: value,
    });
  };

  const validateGrades = () => {
    // Check for 0 or 20 in the grades
    const criticalGrades = Object.entries(grades).filter(
      ([, grade]) => grade === 0 || grade === 20
    );

    if (criticalGrades.length > 0) {
      const confirmation = window.confirm(
        `There are ${criticalGrades.length} grades with 0 or 20. Are you sure you want to proceed?`
      );
      if (!confirmation) {
        return false;
      }
    }

    return true;
  };

  const handleSubmitGrades = () => {
    if (!validateGrades()) return;

    onSubmitGrades(grades);
    setIsEditing(false);
  };

  const handleValidateModule = () => {
    if (!validateGrades()) return;

    onValidateModule(entityName);
    setIsValidated(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setGrades({});
    setIsEditing(true);
  };

  useEffect(() => {
    if (isValidated) {
      setIsEditing(false);
    }
  }, [isValidated]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessorKey as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, index) => (
            <motion.tr
              key={item[primaryKey] as string}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
            >
              {columns.map((col) => (
                <td
                  key={col.accessorKey as string}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                >
                  {isValidated ? (
                    item[col.accessorKey]
                  ) : (
                    <input
                      type="number"
                      value={grades[item[primaryKey]] || ""}
                      onChange={(e) =>
                        handleGradeChange(
                          item[primaryKey],
                          Number(e.target.value)
                        )
                      }
                      disabled={!isEditing}
                      className="px-2 py-1 border border-gray-300 rounded-md"
                    />
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => onShowDetaile(item[primaryKey])}
                >
                  Show Elements
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {!isValidated && (
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handleSubmitGrades}
            disabled={Object.keys(grades).length !== items.length}
          >
            Submit Grades
          </Button>
          <Button variant="outline" onClick={handleValidateModule}>
            Validate Module
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
      <div className="mt-4">
        <Button variant="outline" onClick={onSelectEvaluation}>
          Select or Create Evaluation
        </Button>
      </div>
    </div>
  );
}

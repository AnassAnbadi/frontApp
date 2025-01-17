import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/prof_space_components/Crud_backend/DataTypes/Entity";

interface EntityCrudProps<T> {
  entityName: string;
  columns: Column<T>[];
  items: T[];
  onShowDetaile: (id: keyof T) => Promise<void>;
  primaryKey: keyof T;
}

export function EntityCrud<T extends { [key: string]: any }>({
  entityName,
  columns,
  items,
  onShowDetaile,
  primaryKey,
}: EntityCrudProps<T>) {
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
                  {item[col.accessorKey]}
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
    </div>
  );
}

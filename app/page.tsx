"use client";
import Link from "next/link";
import { useEffect } from "react";

const adminData = JSON.stringify({ id: 1, name: "Admin User", role: "admin" });
const profData = JSON.stringify({
  id: 3,
  nom: "ahmed",
  prenom: "sadraoui",
  nomUtilisateur: "ahmedSadraoui",
  image: null,
  specialite: "math",
});

export default function Home() {
  useEffect(() => {
    // Save data to localStorage or sessionStorage
    sessionStorage.setItem("adminData", adminData);
    sessionStorage.setItem("profData", profData);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
      <p className="text-lg mb-6">Please choose your space:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/adminspace">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Admin Space
          </button>
        </Link>
        <Link href="/profspace">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
            Professor Space
          </button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const profData = JSON.stringify({
  id: 1,
  nom: "ahmed",
  prenom: "sadraoui",
  nomUtilisateur: "ahmedSadraoui",
  image: null,
  specialite: "math",
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static credential check
    if (username === "ahmedSadraoui" && password === "1234") {
      // Store prof data in sessionStorage
      sessionStorage.setItem("profData", profData);
      // Redirect to professor space
      router.push("/profspace/elements");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-4 text-white">
          Professor Login
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-300" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-400 mt-2">{error}</div>}
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

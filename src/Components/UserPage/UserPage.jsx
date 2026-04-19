"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [people, setPeople] = useState([]);
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [peopleRes, loansRes] = await Promise.all([
        axios.get(`${API}/people`),
        axios.get(`${API}/loan`),
      ]);

      setPeople(peopleRes.data.people);
      setLoans(loansRes.data.loans);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserLoans = (userId) =>
    loans.filter((l) => l.userId === userId);

  const filteredUsers = people.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
           <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>

        <input
          className="border px-3 py-2 rounded"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const userLoans = getUserLoans(user.id);
          const activeLoans = userLoans.filter((l) => !l.returned);

          return (
            <div
              key={user.id}
              onClick={() => router.push(`/users/${user.id}`)}
              className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
            >
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.document}</p>

              <div className="mt-3 text-sm space-y-1">
                <p>📚 Total: {userLoans.length}</p>
                <p>📕 Activos: {activeLoans.length}</p>
              </div>

              <div className="mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    activeLoans.length > 0
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {activeLoans.length > 0
                    ? "Con préstamos"
                    : "Disponible"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
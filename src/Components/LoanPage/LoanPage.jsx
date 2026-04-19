"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoansPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${API}/loan`);
      setLoans(res.data.loans);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // 🔴 detectar vencidos
  const isOverdue = (loan) =>
    !loan.returned && loan.dueDate && new Date(loan.dueDate) < new Date();

  // 🔎 filtrado avanzado
  const filteredLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        if (filter === "active") return !loan.returned;
        if (filter === "returned") return loan.returned;
        if (filter === "overdue") return isOverdue(loan);
        return true;
      })
      .filter((loan) => {
        const text =
          (loan.book?.title || "") +
          " " +
          (loan.person?.name || "");

        return text.toLowerCase().includes(search.toLowerCase());
      })
      .sort(
        (a, b) =>
          new Date(b.checkoutDate).getTime() -
          new Date(a.checkoutDate).getTime()
      );
  }, [loans, filter, search]);

  const handleBack = () => {
      router.push('/')
    }

  return (
    <div className="p-6">
        <button
        onClick={() => handleBack()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>
      <h1 className="text-2xl font-bold mb-4">📚 Gestión de Préstamos</h1>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter("all")} className="px-3 py-1 bg-gray-200 rounded">
          Todos
        </button>

        <button onClick={() => setFilter("active")} className="px-3 py-1 bg-yellow-200 rounded">
          Activos
        </button>

        <button onClick={() => setFilter("returned")} className="px-3 py-1 bg-green-200 rounded">
          Devueltos
        </button>

        <button onClick={() => setFilter("overdue")} className="px-3 py-1 bg-red-200 rounded">
          Vencidos 🔴
        </button>

        <input
          className="border px-3 py-1 rounded ml-auto"
          placeholder="Buscar libro o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LISTA */}
      <div className="bg-white shadow rounded overflow-hidden">
        {filteredLoans.length === 0 && (
          <p className="p-4 text-gray-500">No hay préstamos</p>
        )}

        {filteredLoans.map((loan) => {
          const overdue = isOverdue(loan);

          return (
            <div
              key={loan.id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  📕 {loan.book?.title}
                </p>

                <p className="text-sm text-gray-500">
                  👤 {loan.person?.name}
                </p>

                <p className="text-xs text-gray-400">
                  📅 Préstamo:{" "}
                  {new Date(loan.checkoutDate).toLocaleDateString()}
                </p>

                {loan.dueDate && (
                  <p
                    className={`text-xs ${
                      overdue ? "text-red-600 font-bold" : "text-gray-400"
                    }`}
                  >
                    ⏰ Vence:{" "}
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    loan.returned
                      ? "bg-green-200 text-green-800"
                      : overdue
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {loan.returned
                    ? "Devuelto"
                    : overdue
                    ? "Vencido"
                    : "Activo"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [userRes, loansRes] = await Promise.all([
        axios.get(`${API}/people/${id}`),
        axios.get(`${API}/loan/user/${id}`),
      ]);

      // 🔥 IMPORTANTE: tu backend devuelve "peopleId"
      setUser(userRes.data.peopleId || null);

      setLoans(loansRes.data.loans || []);
    } catch (error) {
      console.error(error);
      setUser(null);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // 🔄 loading controlado
  if (loading) {
    return (
      <div className="p-6">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  // ❌ error / no encontrado
  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">Usuario no encontrado</p>
        <button
          onClick={() => router.back()}
          className="mt-3 px-3 py-1 bg-gray-200 rounded"
        >
          ← Volver
        </button>
      </div>
    );
  }

  const activeLoans = loans.filter((l) => !l.returned);

  return (
    <div className="p-6">
      {/* 🔙 volver */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>

      {/* 👤 USER INFO */}
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-500">{user.document}</p>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-white shadow rounded">
          📚 Total préstamos: {loans.length}
        </div>

        <div className="p-4 bg-white shadow rounded">
          📕 Activos: {activeLoans.length}
        </div>
      </div>

      {/* 📕 HISTORIAL */}
      <h2 className="mt-6 font-bold">Historial de préstamos</h2>

      <div className="mt-3 space-y-2">
        {loans.length === 0 && (
          <p className="text-gray-500">Sin préstamos</p>
        )}

        {loans.map((loan) => (
          <div
            key={loan.id}
            className="p-3 bg-white shadow rounded flex justify-between items-center"
          >
            <div>
              <p>📘 {loan.book?.title || "Libro"}</p>

              <p className="text-sm text-gray-500">
                📅 {new Date(loan.checkoutDate).toLocaleDateString()}
              </p>

              {loan.returnDate && (
                <p className="text-xs text-gray-400">
                  🔁 Devuelto:{" "}
                  {new Date(loan.returnDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <span
              className={`text-xs px-2 py-1 rounded ${
                loan.returned
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {loan.returned ? "Devuelto" : "Activo"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
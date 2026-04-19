"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LoanModal({ isOpen, onClose, bookId, onSuccess }) {
  const [people, setPeople] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // cargar usuarios
  useEffect(() => {
    if (!isOpen) return;

    const fetchPeople = async () => {
      const res = await axios.get(`${API}/people`);
      setPeople(res.data.people);
    };

    fetchPeople();
  }, [isOpen]);

  const handleLoan = async () => {
    if (!selectedUser) return alert("Selecciona un usuario");

    try {
      setLoading(true);

      await axios.post(`${API}/loan`, {
        bookId,
        userId: selectedUser,
      });

      onSuccess(); // refrescar datos en BookDetail
      onClose();   // cerrar modal
    } catch (err) {
      console.error(err);
      alert("Error creando préstamo");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">📚 Prestar libro</h2>

        <select
          className="w-full border p-2 rounded"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecciona usuario</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleLoan}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            {loading ? "Prestando..." : "Prestar"}
          </button>
        </div>
      </div>
    </div>
  );
}
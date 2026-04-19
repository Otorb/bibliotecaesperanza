"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [book, setBook] = useState(null);
  const [loans, setLoans] = useState([]);
  const [people, setPeople] = useState([]);

  const [userId, setUserId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // 🔍 filtros
  const [filter, setFilter] = useState("all"); // all | active | returned
  const [search, setSearch] = useState("");

  // 🔁 cargar todo
  const fetchData = async () => {
    try {
      const [bookRes, loanRes, peopleRes] = await Promise.all([
        axios.get(`${API}/book/${id}`),
        axios.get(`${API}/loan/book/${id}`),
        axios.get(`${API}/people`),
      ]);

      setBook(bookRes.data.book);
      setLoans(loanRes.data.loans);
      setPeople(peopleRes.data.people);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // 📦 crear préstamo
  const handleLoan = async () => {
    if (!userId) return alert("Selecciona un usuario");

    try {
      await axios.post(`${API}/loan`, {
        bookId: id,
        userId,
      });

      setOpenModal(false);
      setUserId("");

      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Error al prestar libro");
    }
  };

  // 🔥 devolver libro
  const handleReturn = async (loanId) => {
    try {
      await axios.put(`${API}/loan/${loanId}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Error devolviendo libro");
    }
  };

  if (!book) return <div className="p-6">Cargando...</div>;

  const borrowed = book.quantity - book.available;

  // 🔥 FILTRADO + ORDEN
  const filteredLoans = loans
    .filter((loan) => {
      if (filter === "active") return !loan.returned;
      if (filter === "returned") return loan.returned;
      return true;
    })
    .filter((loan) =>
      loan?.person?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.checkoutDate).getTime() -
        new Date(a.checkoutDate).getTime()
    );

    const handleBack = () => {
      router.push('/books')
    }
  return (
    <div className="p-6">
       <button
        onClick={() => handleBack()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>
      {/* HEADER */}
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="text-gray-600">{book.author}</p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white shadow rounded">📦 Total: {book.quantity}</div>
        <div className="p-4 bg-white shadow rounded">✅ Disponibles: {book.available}</div>
        <div className="p-4 bg-white shadow rounded">📕 Prestados: {borrowed}</div>
      </div>

      {/* BOTÓN PRESTAR */}
      <button
        disabled={book.available <= 0}
        onClick={() => setOpenModal(true)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        📚 Prestar libro
      </button>

      {/* 🔍 FILTROS */}
      <div className="mt-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded ${
            filter === "active" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Activos
        </button>

        <button
          onClick={() => setFilter("returned")}
          className={`px-3 py-1 rounded ${
            filter === "returned" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Devueltos
        </button>

        <input
          placeholder="Buscar persona..."
          className="border px-3 py-1 rounded ml-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOANS */}
      <h2 className="mt-6 font-bold">Préstamos</h2>

      <div className="mt-3 space-y-2">
        {filteredLoans.length === 0 && (
          <p className="text-gray-500">No hay préstamos</p>
        )}

        {filteredLoans.map((loan) => (
          <div
            key={loan.id}
            className="p-3 bg-white shadow rounded flex justify-between items-center"
          >
            <div>
              <p>👤 {loan?.person?.name}</p>

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

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  loan.returned
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {loan.returned ? "Devuelto" : "Activo"}
              </span>

              {!loan.returned && (
                <button
                  onClick={() => handleReturn(loan.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Devolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="font-bold mb-4">Prestar libro</h2>

            <select
              className="w-full border p-2"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
                onClick={() => setOpenModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleLoan}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Prestar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
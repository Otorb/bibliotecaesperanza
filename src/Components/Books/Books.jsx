"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/book`);
      setBooks(res.data.book);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.publisher?.toLowerCase().includes(query) ||
      book.description?.toLowerCase().includes(query) ||
      book.reference?.toLowerCase().includes(query) ||
      book.registerNumber?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Libros {books?.length} </h1>

        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Buscar libro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
          const borrowed = book.quantity - book.available;

          return (
            <div
              key={book.id}
              onClick={() => router.push(`/books/${book.id}`)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
            >
              {/* Título */}
              <h2 className="font-bold text-lg">{book.title}</h2>

              {/* Autor + editorial */}
              <p className="text-sm text-gray-600">
                ✍️ {book.author || "Sin autor"}
              </p>
              <p className="text-sm text-gray-500">
                🏢 {book.publisher}
              </p>

              {/* Referencias */}
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>🔖 Ref: {book.reference}</p>
                <p>🆔 Registro: {book.registerNumber || "—"}</p>
              </div>

              {/* Descripción */}
              {book.description && (
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {book.description}
                </p>
              )}

              {/* Stock */}
              <div className="mt-3 text-sm space-y-1">
                <p>📦 Total: {book.quantity}</p>
                <p>📕 Prestados: {borrowed}</p>
                <p>📗 Disponibles: {book.available}</p>
              </div>

              {/* Estado */}
              <span
                className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                  book.available > 0
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {book.available > 0 ? "Disponible" : "Agotado"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
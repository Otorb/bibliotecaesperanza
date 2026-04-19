"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PublicBooksSearch() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 📦 cargar libros una sola vez
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API}/book`);
        setBooks(res.data.book || []);
      } catch (error) {
        console.error("Error cargando libros:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 🔎 filtro en tiempo real
  const filteredBooks =
    search.trim().length === 0
      ? []
      : books.filter((book) => {
          const q = search.toLowerCase();

          return (
            book.title?.toLowerCase().includes(q) ||
            book.author?.toLowerCase().includes(q) ||
            book.publisher?.toLowerCase().includes(q) ||
            book.reference?.toLowerCase().includes(q)
          );
        });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-2">
        🔎 Buscar libros
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        Escribe para ver si el libro está disponible en la biblioteca
      </p>

      {/* Input */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Ej: Camino de Fe, Juan Pérez..."
        className="w-full border px-3 py-2 rounded mb-6"
      />

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Cargando libros...</p>
      )}

      {/* Sin resultados inicial */}
      {!loading && search.trim().length === 0 && (
        <p className="text-gray-400">
          Escribe algo para buscar libros
        </p>
      )}

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((book) => {
          const isAvailable = book.available > 0;

          return (
            <div
              key={book.id}
              className="bg-white p-4 rounded shadow"
            >
              {/* Título */}
              <h2 className="font-bold text-lg">
                {book.title}
              </h2>

              {/* Autor */}
              <p className="text-sm text-gray-600">
                ✍️ {book.author || "Sin autor"}
              </p>

              {/* Editorial */}
              <p className="text-sm text-gray-500">
                🏢 {book.publisher}
              </p>

              {/* Referencia */}
              <p className="text-xs text-gray-500 mt-2">
                🔖 Ref: {book.reference}
              </p>

              {/* Estado claro */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded font-semibold ${
                    isAvailable
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {isAvailable
                    ? "📗 Disponible en biblioteca"
                    : "📕 Actualmente prestado"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sin resultados */}
      {!loading &&
        search.trim().length > 0 &&
        filteredBooks.length === 0 && (
          <p className="text-gray-500 mt-4">
            No se encontraron libros
          </p>
        )}
    </div>
  );
}
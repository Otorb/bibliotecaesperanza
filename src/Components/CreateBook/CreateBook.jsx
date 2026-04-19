"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateBook() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    reference: "",
    registerNumber: "",
    description: "",
    quantity: 0,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/book`, {
        ...form,
        available: form.quantity, // al crear, todos disponibles
      });

      router.push("/books");
    } catch (error) {
      console.error(error);
      alert("Error al crear el libro");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => router.push("/books")}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">➕ Crear Libro</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Título"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="author"
          placeholder="Autor"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="publisher"
          placeholder="Editorial"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="reference"
          placeholder="Referencia"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="registerNumber"
          placeholder="Número de registro"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
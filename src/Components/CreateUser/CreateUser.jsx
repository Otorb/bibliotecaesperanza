
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    name: "",
    document: "",
    grade: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const grades = [
    "infantil",
    "primaria",
    "secundaria",
    "bachiller",
    "teologia",
    "musica",
    "deporte",
    "voluntario",
    "docente",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.document) {
      alert("Nombre y documento son obligatorios");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/people`, form);

      router.push("/users");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error al crear usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => router.push("/users")}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">➕ Crear Usuario</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Documento */}
        <input
          name="document"
          placeholder="Documento"
          value={form.document}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Grado */}
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccionar grado</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Activo */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Usuario activo
        </label>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
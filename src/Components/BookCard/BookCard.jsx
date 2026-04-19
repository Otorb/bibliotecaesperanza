"use client";
import React from 'react'

function BookCard({ title, author, available }) {
  return (
   <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600">Autor: {author}</p>
      <p className={`mt-2 font-medium ${available ? 'text-green-600' : 'text-red-600'}`}>
        {available ? 'Disponible' : 'Prestado'}
      </p>
    </div>
  )
}

export default BookCard
"use client";
import React from 'react'

function UserCard({ name, email, booksBorrowed }) {
  return (
   <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      <p className="mt-2 text-gray-700">Libros prestados: {booksBorrowed}</p>
    </div>
  )
}

export default UserCard
"use client";
import React from 'react'

function StatCard({ title, value, icon }) {
  return (
     <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
"use client";
import React from 'react'
import { useState } from 'react';
import { FaBook, FaUser, FaHome, FaBars,FaUserPlus, FaHandHolding } from 'react-icons/fa';
import { BiSolidBookAdd } from 'react-icons/bi';



function Sidebar() {
    const [open, setOpen] = useState(true);
{/* <BiSolidBookAdd /> */}
  const menuItems = [
    { name: 'Inicio', icon: <FaHome />, link: '/' },
    { name: 'Libros', icon: <FaBook />, link: '/books' },
    { name: 'Agregar Libro', icon: <BiSolidBookAdd />, link: '/crearlibro' },

    { name: 'Usuarios', icon: <FaUser />, link: '/users' },
    { name: 'Agregar Usuario', icon: <FaUserPlus />, link: '/crearusuario' },
    { name: 'Prestamos', icon: <FaHandHolding /> , link: '/prestamos' },
  ];
  return (
    <div className={`bg-blue-600 text-white h-screen p-4 flex flex-col transition-width duration-300 ${open ? 'w-64' : 'w-16'}`}>
      <button onClick={() => setOpen(!open)} className="mb-6 self-end">
        <FaBars />
      </button>
      {menuItems.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          className="flex items-center gap-4 py-2 px-2 rounded hover:bg-blue-500 transition"
        >
          <span className="text-xl">{item.icon}</span>
          {open && <span>{item.name}</span>}
        </a>
      ))}
    </div>
  )
}

export default Sidebar
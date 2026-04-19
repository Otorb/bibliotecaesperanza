"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `px-3 py-2 rounded transition ${
      pathname === path
        ? "bg-white text-blue-600 font-semibold"
        : "hover:bg-blue-500"
    }`;

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      {/* Logo / título */}
      <h1 className="text-xl font-bold">📚 Biblioteca Esperanza</h1>

      {/* Links */}
      <div className="flex gap-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Admin
        </Link>

        <Link href="/books" className={linkClass("/books")}>
          Libros
        </Link>

        <Link href="/users" className={linkClass("/users")}>
          Usuarios
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
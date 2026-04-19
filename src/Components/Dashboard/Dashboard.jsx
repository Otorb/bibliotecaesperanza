"use client";

import React, { useEffect, useMemo } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import StatCard from "../StatCard/StatCard";
import { FaBook, FaUser, FaClipboardList, FaTrophy } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, getPeople, getLoans } from "../../redux/action.js";
import LoanAlerts from "../LoansAlerts/LoanAlerts";

function Dashboard() {
  const dispatch = useDispatch();

  const people = useSelector((state) => state.people) || [];
  const loans = useSelector((state) => state.loans) || [];
  const books = useSelector((state) => state.books) || [];

  useEffect(() => {
    dispatch(getBooks());
    dispatch(getPeople());
    dispatch(getLoans());
  }, [dispatch]);

  // 🔥 préstamos activos / devueltos
  const activeLoans = loans.filter((l) => !l.returned);
  const returnedLoans = loans.filter((l) => l.returned);

  // 📚 total libros prestados (stock real)
  const borrowedBooks = books.reduce(
    (acc, b) => acc + (b.quantity - b.available),
    0
  );

  // 👤 usuario más activo
  const topUser = useMemo(() => {
    const count = {};

    loans.forEach((l) => {
      const name = l.person?.name;
      if (!name) return;
      count[name] = (count[name] || 0) + 1;
    });

    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
    return sorted[0] || null;
  }, [loans]);

  // 📕 libro más prestado
  const topBook = useMemo(() => {
    const count = {};

    loans.forEach((l) => {
      const title = l.book?.title;
      if (!title) return;
      count[title] = (count[title] || 0) + 1;
    });

    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
    return sorted[0] || null;
  }, [loans]);

  // 📊 stats base
  const stats = [
    { title: "Libros", value: books.length, icon: <FaBook /> },
    { title: "Usuarios", value: people.length, icon: <FaUser /> },
    {
      title: "Préstamos activos",
      value: activeLoans.length,
      icon: <FaClipboardList />,
    },
    {
      title: "Préstamos devueltos",
      value: returnedLoans.length,
      icon: <FaClipboardList />,
    },
    {
      title: "Libros prestados",
      value: borrowedBooks,
      icon: <FaBook />,
    },
  ];

  // 📘 últimos libros
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // 📕 últimos préstamos
  const recentLoans = [...loans]
    .sort(
      (a, b) =>
        new Date(b.checkoutDate).getTime() -
        new Date(a.checkoutDate).getTime()
    )
    .slice(0, 5);

  // 📈 actividad por día (mini gráfico simple)
  const loansByDay = useMemo(() => {
    const map = {};

    loans.forEach((l) => {
      const date = new Date(l.checkoutDate).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map).slice(-7);
  }, [loans]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        {/* <Navbar /> */}

        {/* STATS */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* TOPS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold flex items-center gap-2">
              <FaTrophy /> Usuario más activo
            </h3>
            <p className="text-gray-600 mt-2">
              {topUser ? `${topUser[0]} (${topUser[1]} préstamos)` : "Sin datos"}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold flex items-center gap-2">
              <FaBook /> Libro más prestado
            </h3>
            <p className="text-gray-600 mt-2">
              {topBook ? `${topBook[0]} (${topBook[1]} veces)` : "Sin datos"}
            </p>
          </div>
        </div>

        {/* LIBROS */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Últimos libros agregados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-xs text-gray-400">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
<LoanAlerts loans={loans} />
        {/* PRÉSTAMOS */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Préstamos recientes
          </h2>

          <div className="bg-white rounded shadow overflow-hidden">
            {recentLoans.length === 0 && (
              <p className="p-4 text-gray-500">No hay préstamos aún</p>
            )}

            {recentLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <p className="font-medium">
                    📕 {loan.book?.title || "Libro"}
                  </p>

                  <p className="text-sm text-gray-500">
                    👤 {loan.person?.name || "Usuario"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(loan.checkoutDate).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    loan.returned
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {loan.returned ? "Devuelto" : "Activo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 📈 MINI GRAFICO SIMPLE */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Actividad de préstamos (últimos días)
          </h2>

          <div className="bg-white p-4 rounded shadow space-y-2">
            {loansByDay.map(([date, count]) => (
              <div key={date} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-600">
                  {date}
                </span>

                <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
                  <div
                    className="bg-blue-500 h-3"
                    style={{ width: `${count * 20}%` }}
                  />
                </div>

                <span className="text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
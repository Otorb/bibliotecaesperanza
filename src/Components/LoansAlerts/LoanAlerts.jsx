"use client";

import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaClock } from "react-icons/fa";
import { getLoanStatus } from "../../redux/action.js";

export default function LoanAlerts({ loans }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const overdue = loans.filter((l) => getLoanStatus(l) === "overdue");
    const warning = loans.filter((l) => getLoanStatus(l) === "warning");

    const newAlerts = [];

    if (overdue.length > 0) {
      newAlerts.push({
        id: "overdue",
        type: "error",
        title: "Préstamos vencidos",
        message: `Tienes ${overdue.length} préstamos vencidos`,
      });
    }

    if (warning.length > 0) {
      newAlerts.push({
        id: "warning",
        type: "warning",
        title: "Préstamos por vencer",
        message: `Tienes ${warning.length} próximos a vencer`,
      });
    }

    setAlerts(newAlerts);

    if (newAlerts.length === 0) return;

    // ⏱ auto eliminar en 3 segundos
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [loans]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 space-y-3 z-50 w-80">

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded shadow-lg text-white transition-all
            ${alert.type === "error" ? "bg-red-500" : "bg-yellow-500"}
          `}
        >
          <div className="flex items-center gap-2 font-bold">
            {alert.type === "error" ? (
              <FaExclamationTriangle />
            ) : (
              <FaClock />
            )}
            {alert.title}
          </div>

          <p className="text-sm mt-1">{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
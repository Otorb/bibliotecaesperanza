"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/Components/Dashboard/Dashboard";
import PublicBooks from "@/Components/SearchBar/SearchBar";

export default function Home() {


  return (
    <div>
      <PublicBooks />
    </div>
  );
}
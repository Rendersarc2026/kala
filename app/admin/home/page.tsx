"use client";

import React from "react";
import AdminHome from "@/components/AdminHome";
import AdminAbout from "@/components/AdminAbout";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <AdminHome />
      <AdminAbout />
    </div>
  );
}

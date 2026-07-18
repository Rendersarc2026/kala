"use client";

import React from "react";
import AdminTeam from "@/components/AdminTeam";
import AdminCoreValues from "@/components/AdminCoreValues";

export default function AdminAboutPage() {
  return (
    <div className="space-y-16">
      <AdminCoreValues />
      <AdminTeam />
    </div>
  );
}

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-900 md:flex md:h-screen md:overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1 md:h-screen md:overflow-y-auto">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

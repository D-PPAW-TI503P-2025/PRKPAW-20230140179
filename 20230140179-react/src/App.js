import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import AdminPage from "./components/AdminPage";
import ReportPage from "./components/ReportsPage";
import SensorPage from "./components/SensorPage"; // ✅ TAMBAHAN

function App() {
  // Navbar links
  const navLinks = [
    { path: "/login", label: "Login", bg: "bg-amber-400", hover: "hover:bg-amber-500" },
    { path: "/register", label: "Register", bg: "bg-yellow-300", hover: "hover:bg-yellow-400" },
    { path: "/dashboard", label: "Dashboard", bg: "bg-amber-300", hover: "hover:bg-amber-400" },
    { path: "/presensi", label: "Presensi", bg: "bg-amber-300", hover: "hover:bg-amber-400" },
    { path: "/monitoring", label: "Monitoring", bg: "bg-orange-400", hover: "hover:bg-orange-500" }, // ✅ TAMBAHAN
    { path: "/admin", label: "Admin", bg: "bg-amber-400", hover: "hover:bg-amber-500" },
    { path: "/laporan", label: "Laporan", bg: "bg-amber-300", hover: "hover:bg-amber-400" },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-amber-50 font-sans">
        {/* ===== Navbar ===== */}
        <nav className="bg-amber-200 p-4 flex justify-between items-center rounded-b-2xl shadow-md">
          <h1 className="text-xl font-bold text-amber-900">PAW</h1>
          <div className="flex space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${link.bg} ${link.hover} text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ===== Page Content ===== */}
        <div className="p-4 max-w-5xl mx-auto mt-6">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/presensi" element={<PresensiPage />} />
            <Route path="/monitoring" element={<SensorPage />} /> {/* ✅ TAMBAHAN */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/laporan" element={<ReportPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
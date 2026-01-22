import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // gunakan named import

const AdminPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  // Cek role admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Akses ditolak! Hanya admin yang bisa membuka halaman ini.");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    }
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      let url = "http://localhost:3001/api/reports/daily";
      const params = new URLSearchParams();
      if (filterNama) params.append("nama", filterNama);
      if (filterTanggal) params.append("tanggal", filterTanggal);
      if ([...params].length) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengambil laporan presensi.");
      }

      const data = await response.json();
      setReports(data.data || []);
    } catch (err) {
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("id-ID") : "-";

  return (
    <div className="min-h-screen bg-amber-50 font-sans p-4">
      <h1 className="text-2xl font-bold text-amber-900 mb-4">
        Admin Panel - Laporan Presensi
      </h1>

      <div className="mb-4 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Cari nama..."
          value={filterNama}
          onChange={(e) => setFilterNama(e.target.value)}
          className="p-2 rounded border border-amber-300"
        />
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="p-2 rounded border border-amber-300"
        />
        <button
          onClick={fetchReports}
          className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded shadow-sm"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-amber-300">
            <thead className="bg-amber-200">
              <tr>
                <th className="border border-amber-300 p-2">ID</th>
                <th className="border border-amber-300 p-2">Nama</th>
                <th className="border border-amber-300 p-2">Email</th>
                <th className="border border-amber-300 p-2">Role</th>
                <th className="border border-amber-300 p-2">Check-In</th>
                <th className="border border-amber-300 p-2">Check-Out</th>
                <th className="border border-amber-300 p-2">Latitude</th>
                <th className="border border-amber-300 p-2">Longitude</th>
                <th className="border border-amber-300 p-2">Foto</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-amber-300 p-2">{item.id}</td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.nama || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.email || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.user?.role || "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {formatDate(item.checkIn)}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {formatDate(item.checkOut)}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.latitude ?? "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.longitude ?? "-"}
                    </td>
                    <td className="border border-amber-300 p-2">
                      {item.buktiFoto ? (
                        <img
                          src={`http://localhost:3001/${item.buktiFoto}`}
                          alt="Bukti Foto"
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// URL Dasar Server untuk mengakses file statis dari folder 'uploads'
const BASE_URL = "http://localhost:3001/"; 

// --- KOMPONEN MODAL (Popup Gambar) ---
const PhotoModal = ({ isOpen, onClose, photoUrl }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // Tutup modal saat klik di luar gambar
    >
      <div 
        className="max-w-4xl max-h-4xl p-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Cegah penutupan saat klik di dalam modal
      >
        <img 
          src={photoUrl} 
          alt="Bukti Presensi Ukuran Penuh" 
          className="max-w-full max-h-[80vh] object-contain"
        />
        <button 
          onClick={onClose} 
          className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
// -------------------------------------

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State baru untuk Modal Foto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  const handleShowModal = (url) => {
    setCurrentPhotoUrl(url);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPhotoUrl('');
  };

  // Menggunakan useCallback untuk menstabilkan fetchReports
  const fetchReports = useCallback(async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const baseUrl = "http://localhost:3001/api/reports/daily";
      const url = query ? `${baseUrl}?nama=${query}` : baseUrl;

      const response = await axios.get(url, config);
      setReports(response.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  }, [navigate]); 

  // Memperbaiki dependency array: menggunakan fetchReports dan navigate
  useEffect(() => {
    fetchReports("");
  }, [navigate, fetchReports]); 
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longitude
                </th>
                {/* TAMBAHKAN KOLOM BUKTI FOTO */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "Belum Check-Out"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.latitude || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.longitude || "N/A"}
                    </td>
                    {/* IMPLEMENTASI TAMPILAN BUKTI FOTO */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.buktiFoto ? (
                        <img
                          // Menggunakan BASE_URL + path dari database (misal: uploads/1-123.jpg)
                          src={`${BASE_URL}${presensi.buktiFoto}`}
                          alt="Bukti Selfie"
                          className="w-12 h-12 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                          onClick={() => handleShowModal(`${BASE_URL}${presensi.buktiFoto}`)}
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6" // Mengubah colSpan menjadi 6 untuk mencakup kolom baru
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Komponen Modal untuk Gambar Ukuran Penuh */}
      <PhotoModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photoUrl={currentPhotoUrl}
      />
    </div>
  );
}

export default ReportPage;
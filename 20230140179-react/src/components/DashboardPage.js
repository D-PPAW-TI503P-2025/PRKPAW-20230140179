import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari local storage [cite: 172, 206]
    navigate('/login'); // Arahkan kembali ke halaman login [cite: 173, 207]
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">
          Selamat Datang! 🎉
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Anda telah berhasil login. Ini adalah Halaman Dashboard Anda.
        </p>
        
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-8">
            <p className="text-sm text-yellow-800">
                Token Anda saat ini tersimpan di Local Storage browser.
            </p>
        </div>

        <button
          onClick={handleLogout}
          className="py-3 px-8 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
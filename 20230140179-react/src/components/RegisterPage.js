import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // === PERUBAHAN UTAMA: MENGGUNAKAN 'nama' BUKAN 'name' ===
  const [nama, setNama] = useState(''); // Diubah dari [name, setName]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Kirim data ke endpoint register
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama, // <--- PAYLOAD DIUBAH menjadi 'nama'
        email: email,
        password: password,
        role: role
      });
      
      alert(response.data.message || 'Registrasi berhasil! Silakan Login.');
      
      // Arahkan pengguna ke halaman /login setelah sukses
      navigate('/login'); 
      
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal. Cek koneksi server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
          Registrasi Akun
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap:</label>
            <input
              id="nama" // ID diubah menjadi 'nama'
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)} // setState diubah menjadi setNama
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Field Email dan Password */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Field Role (Pilih antara Mahasiswa atau Admin) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition duration-150"
          >
            Register
          </button>
        </form>
        
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center p-2 bg-red-100 rounded-md border border-red-300">{error}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  
  // ✅ UPDATE: Menambahkan state untuk motion
  const [latest, setLatest] = useState({
    suhu: 0,
    lembab: 0,
    cahaya: 0,
    motion: 0, 
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/iot/history');
      const dataSensor = response.data.data;

      const labels = dataSensor.map(item =>
        new Date(item.createdAt).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      const dataSuhu = dataSensor.map(item => item.suhu);
      const dataLembab = dataSensor.map(item => item.kelembaban);
      const dataCahaya = dataSensor.map(item => item.cahaya);

      // Simpan data terakhir untuk card
      const last = dataSensor[dataSensor.length - 1];
      if (last) {
        setLatest({
          suhu: last.suhu,
          lembab: last.kelembaban,
          cahaya: last.cahaya,
          motion: last.motion, // ✅ Ambil data motion terakhir
        });
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSuhu,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
            yAxisID: 'y',
          },
          {
            label: 'Kelembaban (%)',
            data: dataLembab,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
            yAxisID: 'y',
          },
          {
            label: 'Cahaya (LDR)',
            data: dataCahaya,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            tension: 0.3,
            yAxisID: 'y1',
          },
        ],
      });

      setLoading(false);
    } catch (err) {
      console.error('Gagal ambil data sensor:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Monitoring Suhu, Kelembaban & Cahaya',
      },
    },
    scales: {
      y: {
        position: 'left',
        title: { display: true, text: 'Suhu / Kelembaban' },
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'Cahaya (LDR)' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard IoT</h1>

      {/* ===== CARD INDIKATOR ===== */}
      {/* Grid diubah jadi 4 kolom untuk menampung Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card Suhu */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium">Suhu</h3>
          <p className="text-2xl font-bold text-gray-800">{latest.suhu} °C</p>
        </div>

        {/* Card Kelembaban */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Kelembaban</h3>
          <p className="text-2xl font-bold text-gray-800">{latest.lembab} %</p>
        </div>

        {/* Card Cahaya */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
          <h3 className="text-gray-500 text-sm font-medium">Cahaya</h3>
          <p className="text-2xl font-bold text-gray-800">{latest.cahaya}</p>
        </div>

        {/* ✅ CARD BARU: MOTION DETECTOR */}
        <div className={`p-4 rounded-lg shadow border-l-4 transition-colors duration-300 ${latest.motion ? 'bg-red-50 border-red-600' : 'bg-green-50 border-green-500'}`}>
          <h3 className="text-gray-600 text-sm font-medium">Status Gerakan</h3>
          <p className={`text-2xl font-bold ${latest.motion ? 'text-red-600' : 'text-green-600'}`}>
            {latest.motion ? '⚠️ ADA GERAKAN' : '✅ AMAN'}
          </p>
        </div>

      </div>

      {/* ===== GRAFIK ===== */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center text-gray-500">Sedang memuat data...</p>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SensorPage;
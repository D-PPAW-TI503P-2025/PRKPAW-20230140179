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

// Registrasi komponen Chart.js
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
  const [latest, setLatest] = useState({
    suhu: 0,
    lembab: 0,
    cahaya: 0,
  });
  const [loading, setLoading] = useState(true);

  // Ambil data dari backend
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

  // Auto refresh tiap 5 detik
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Opsi grafik (multi-axis)
  const options = {
    responsive: true,
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
        title: {
          display: true,
          text: 'Suhu / Kelembaban',
        },
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Cahaya (LDR)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard IoT</h1>

      {/* ===== CARD INDIKATOR ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Suhu Terakhir</h3>
          <p className="text-2xl font-bold">{latest.suhu} °C</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Kelembaban Terakhir</h3>
          <p className="text-2xl font-bold">{latest.lembab} %</p>
        </div>
        <div className="bg-yellow-400 text-black p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Cahaya Terakhir</h3>
          <p className="text-2xl font-bold">{latest.cahaya}</p>
        </div>
      </div>

      {/* ===== GRAFIK ===== */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SensorPage;
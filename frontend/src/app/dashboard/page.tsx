'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // --- Données dynamiques pour tous les graphiques ---
  const getLineData = () => {
    if (period === 'week') return [200, 400, 350, 500, 700, 600, 800];
    if (period === 'month') return [1000, 1200, 1500, 1300, 1400, 1800, 1700, 1900, 2100, 2200, 2300, 2500];
    if (period === 'year') return [5000, 7000, 8000, 7500, 9000, 9500, 10000, 11000, 11500, 12000, 12500, 13000];
    return [];
  };

  const getPieData = () => {
    if (period === 'week') return [70, 20, 10];
    if (period === 'month') return [600, 300, 100];
    if (period === 'year') return [7000, 2000, 500];
    return [];
  };

  const getBarData = () => {
    if (period === 'week') return [{ name: 'Actives', data: [8] }, { name: 'Terminées', data: [12] }];
    if (period === 'month') return [{ name: 'Actives', data: [30] }, { name: 'Terminées', data: [45] }];
    if (period === 'year') return [{ name: 'Actives', data: [200] }, { name: 'Terminées', data: [350] }];
    return [];
  };

  const getLineCategories = () => {
    if (period === 'week') return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    if (period === 'month') return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    if (period === 'year') return Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
    return [];
  };

  // --- Options graphiques ---
  const lineOptions = {
    chart: { type: 'line', toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: getLineCategories() },
    colors: ['#16a34a'],
    dataLabels: { enabled: false },
  };
  const lineSeries = [{ name: 'Messages', data: getLineData() }];

  const pieOptions = {
    labels: ['Envoyés', 'Lus', 'Échoués'],
    colors: ['#3b82f6', '#16a34a', '#dc2626'],
    legend: { position: 'bottom' },
    chart: { animations: { enabled: true, speed: 800, easing: 'easeinout' } },
  };
  const pieSeries = getPieData();

  const barOptions = {
    chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    xaxis: { categories: ['Campagnes'] },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
    colors: ['#16a34a', '#9ca3af'],
  };
  const barSeries = getBarData();

  return (
    <div className="space-y-8">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ title: 'Messages envoyés', value: 1200 }, { title: 'Campagnes actives', value: 8 }, { title: 'Utilisateurs', value: 15 }].map((card, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex justify-end gap-4 items-center">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
          className="border rounded-md p-2 text-sm"
        >
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Date début"
          className="border rounded-md p-2 text-sm"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Date fin"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      {/* Graphiques avancés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Messages envoyés ({period})</h3>
          <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des messages</h3>
          <Chart options={pieOptions} series={pieSeries} type="donut" height={300} />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Campagnes</h3>
        <Chart options={barOptions} series={barSeries} type="bar" height={300} />
      </div>
    </div>
  );
}

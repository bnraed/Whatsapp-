'use client';
import { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const messages = [
    { to: '+216 90 123 456', message: 'Bonjour 👋', status: 'Envoyé', date: '2025-08-01' },
    { to: '+216 99 654 321', message: 'Offre spéciale 🎁', status: 'Lu', date: '2025-08-02' },
    { to: '+216 22 333 444', message: 'Merci de votre fidélité', status: 'Échoué', date: '2025-08-03' },
    { to: '+216 21 111 222', message: 'Promo exceptionnelle', status: 'Envoyé', date: '2025-08-04' },
    { to: '+216 29 333 444', message: 'Rappel RDV', status: 'Lu', date: '2025-08-05' },
    { to: '+216 25 555 666', message: 'Nouveau produit dispo', status: 'Envoyé', date: '2025-08-06' },
    { to: '+216 20 777 888', message: 'Merci !', status: 'Échoué', date: '2025-08-07' },
  ];

  // --- Filtrage complet ---
  const filteredMessages = useMemo(() => {
    return messages.filter(
      (msg) =>
        (statusFilter === 'all' || msg.status === statusFilter) &&
        (!startDate || new Date(msg.date) >= startDate) &&
        (!endDate || new Date(msg.date) <= endDate) &&
        (msg.to.includes(search) || msg.message.toLowerCase().includes(search.toLowerCase()))
    );
  }, [statusFilter, startDate, endDate, search, messages]);

  // --- Pagination ---
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // --- Export ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Messages WhatsApp', 14, 10);
    autoTable(doc, {
      head: [['Destinataire', 'Message', 'Statut', 'Date']],
      body: filteredMessages.map((m) => [m.to, m.message, m.status, m.date]),
    });
    doc.save('messages.pdf');
    toast.success('Export PDF réussi !');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredMessages);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Messages');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'messages.xlsx');
    toast.success('Export Excel réussi !');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Messages</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher un destinataire ou message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md p-2 text-sm w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md p-2 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="Envoyé">Envoyés</option>
          <option value="Lu">Lus</option>
          <option value="Échoué">Échoués</option>
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
        <button onClick={exportPDF} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export PDF
        </button>
        <button onClick={exportExcel} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export Excel
        </button>
      </div>

      {/* Tableau messages */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">Destinataire</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">Message</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentMessages.map((msg, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{msg.to}</td>
                <td className="py-3 px-4 text-sm">{msg.message}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      msg.status === 'Envoyé'
                        ? 'bg-blue-100 text-blue-700'
                        : msg.status === 'Lu'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{msg.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

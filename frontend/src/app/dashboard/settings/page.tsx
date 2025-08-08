'use client';
import { useState } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const [form, setForm] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/whatsapp/connect', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Paramètres sauvegardés !');
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Paramètres WhatsApp</h2>
      <form onSubmit={saveSettings} className="space-y-4">
        <input name="appId" placeholder="App ID" value={form.appId} onChange={handleChange} className="w-full border p-3 rounded" />
        <input name="appSecret" placeholder="App Secret" value={form.appSecret} onChange={handleChange} className="w-full border p-3 rounded" />
        <input name="accessToken" placeholder="Access Token" value={form.accessToken} onChange={handleChange} className="w-full border p-3 rounded" />
        <input name="phoneNumberId" placeholder="Phone Number ID" value={form.phoneNumberId} onChange={handleChange} className="w-full border p-3 rounded" />
        <input name="businessAccountId" placeholder="Business Account ID" value={form.businessAccountId} onChange={handleChange} className="w-full border p-3 rounded" />
        <button className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700">Sauvegarder</button>
      </form>
    </div>
  );
}

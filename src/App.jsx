import React, { useState, useEffect } from 'react';
import StatsHeader from './components/StatsHeader';
import PipelineBoard from './components/PipelineBoard';
import { Plus, LayoutGrid, X } from 'lucide-react';

const INITIAL_DEALS = [
  { id: '1', name: 'Website E-Commerce PT. Jaya', client: 'PT. Jaya Baru', value: 150000000, status: 'won', owner: 'Budi Santoso' },
  { id: '2', name: 'Aplikasi Mobile Sales', client: 'Astra Group', value: 250000000, status: 'negotiation', owner: 'Siti Rahma' },
  { id: '3', name: 'Migrasi Cloud Server', client: 'Bank Nusantara', value: 80000000, status: 'proposal', owner: 'Rian Dimas' },
  { id: '4', name: 'Sistem HRIS Terintegrasi', client: 'PT. Pangan Mandiri', value: 350000000, status: 'lost', owner: 'Dewi Lestari' },
  { id: '5', name: 'Maintenance & Security Audit', client: 'Pertamina Utama', value: 450000000, status: 'prospect', owner: 'Andi Wijaya' }
];

export default function App() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', client: '', value: '', status: 'prospect', owner: '' });
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_deals', JSON.stringify(deals));
  }, [deals]);

  const handleMoveStatus = (dealId, newStatus) => {
    setDeals(prevDeals =>
      prevDeals.map(d => (d.id === dealId ? { ...d, status: newStatus } : d))
    );
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      setDeals(prevDeals => prevDeals.filter(d => d.id !== dealId));
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan ke data awal?')) {
      setDeals(INITIAL_DEALS);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
    setFormData({ name: '', client: '', value: '', status: 'prospect', owner: '' });
  };

  const handleTriggerEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      client: deal.client,
      value: deal.value.toString(),
      status: deal.status,
      owner: deal.owner || ''
    });
    setIsModalOpen(true);
  };

  const handleTriggerAdd = () => {
    setEditingDeal(null);
    setFormData({ name: '', client: '', value: '', status: 'prospect', owner: '' });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return;

    if (editingDeal) {
      setDeals(prevDeals =>
        prevDeals.map(d =>
          d.id === editingDeal.id
            ? {
                ...d,
                name: formData.name,
                client: formData.client || 'Umum',
                value: parseFloat(formData.value),
                status: formData.status,
                owner: formData.owner || 'Tanpa PIC'
              }
            : d
        )
      );
    } else {
      const newDeal = {
        id: Date.now().toString(),
        name: formData.name,
        client: formData.client || 'Umum',
        value: parseFloat(formData.value),
        status: formData.status,
        owner: formData.owner || 'Tanpa PIC'
      };
      setDeals(prevDeals => [...prevDeals, newDeal]);
    }

    handleCloseModal();
  };

  return (
    <div className="crm-container">
      {/* Header */}
      <header className="crm-header glass">
        <div className="brand-section">
          <LayoutGrid size={32} className="brand-icon" />
          <div>
            <h1 className="brand-title">CRM Project Pipeline</h1>
            <span className="brand-tagline">Sales & Project Tracking untuk Tim Internal</span>
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleResetData}>
            Reset Data
          </button>
          <button className="btn btn-primary" onClick={handleTriggerAdd}>
            <Plus size={18} />
            Tambah Proyek
          </button>
        </div>
      </header>

      {/* Metrics Header */}
      <StatsHeader deals={deals} />

      {/* Kanban Board */}
      <PipelineBoard
        deals={deals}
        onMoveStatus={handleMoveStatus}
        onDeleteDeal={handleDeleteDeal}
        onEditDeal={handleTriggerEdit}
      />

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={20} />
            </button>
            <h3 className="modal-title">{editingDeal ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Nama Proyek *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Redesign Website"
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Klien / Perusahaan</label>
                <input
                  type="text"
                  placeholder="Contoh: PT. ABC"
                  className="form-input"
                  value={formData.client}
                  onChange={e => setFormData({ ...formData, client: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pemilik Proyek (Owner)</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="form-input"
                  value={formData.owner}
                  onChange={e => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nilai Proyek (IDR) *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 150000000"
                  className="form-input"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{editingDeal ? 'Status Proyek' : 'Tahap Status Awal'}</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="prospect">Prospect</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negosiasi</option>
                  <option value="won">Won (Goal)</option>
                  <option value="lost">Lost (Gagal)</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDeal ? 'Simpan Perubahan' : 'Simpan Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

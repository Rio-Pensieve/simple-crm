import React from 'react';
import { ArrowLeft, ArrowRight, Trash2, Building, User, Pencil } from 'lucide-react';

export default function DealCard({ deal, onMoveStatus, onDeleteDeal, onEditDeal }) {
  const statuses = ['prospect', 'proposal', 'negotiation', 'won', 'lost'];
  const currentIndex = statuses.indexOf(deal.status);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div
      className={`deal-card status-${deal.status}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="deal-header">
        <h4 className="deal-title">{deal.name}</h4>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            className="action-btn"
            onClick={() => onEditDeal(deal)}
            title="Edit Proyek"
          >
            <Pencil size={14} />
          </button>
          <button 
            className="action-btn" 
            onClick={() => onDeleteDeal(deal.id)}
            title="Hapus Proyek"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="deal-value">
        {formatCurrency(deal.value)}
      </div>

      <div className="deal-meta">
        <div className="deal-meta-info">
          <span className="deal-client" title="Klien">
            <Building size={12} />
            {deal.client || 'Umum'}
          </span>
          <span className="deal-owner" title="Pemilik Proyek">
            <User size={12} />
            {deal.owner || 'Tanpa PIC'}
          </span>
        </div>
        
        <div className="deal-meta-actions">
          <div className="card-actions">
            {currentIndex > 0 && (
              <button
                className="action-btn"
                onClick={() => onMoveStatus(deal.id, statuses[currentIndex - 1])}
                title={`Pindahkan ke ${statuses[currentIndex - 1]}`}
              >
                <ArrowLeft size={14} />
              </button>
            )}
            {currentIndex < statuses.length - 1 && (
              <button
                className="action-btn"
                onClick={() => onMoveStatus(deal.id, statuses[currentIndex + 1])}
                title={`Pindahkan ke ${statuses[currentIndex + 1]}`}
              >
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

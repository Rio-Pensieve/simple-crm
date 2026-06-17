import React, { useState } from 'react';
import DealCard from './DealCard';

const COLUMNS = [
  { id: 'prospect', title: 'Prospect', color: 'var(--color-prospect)' },
  { id: 'proposal', title: 'Proposal', color: 'var(--color-proposal)' },
  { id: 'negotiation', title: 'Negosiasi', color: 'var(--color-negotiation)' },
  { id: 'won', title: 'Won (Goal)', color: 'var(--color-won)' },
  { id: 'lost', title: 'Lost (Gagal)', color: 'var(--color-lost)' }
];

export default function PipelineBoard({ deals, onMoveStatus, onDeleteDeal, onEditDeal }) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      onMoveStatus(dealId, columnId);
    }
  };

  return (
    <div className="pipeline-board">
      {COLUMNS.map((col) => {
        const columnDeals = deals.filter((d) => d.status === col.id);
        const columnTotalValue = columnDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div
            key={col.id}
            className={`pipeline-column ${dragOverColumn === col.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="column-header">
              <div className="column-title-area">
                <span 
                  className="column-dot" 
                  style={{ backgroundColor: col.color }} 
                />
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count">{columnDeals.length}</span>
              </div>
              <div className="column-value">
                {formatCurrency(columnTotalValue)}
              </div>
            </div>

            <div className="cards-container">
              {columnDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onMoveStatus={onMoveStatus}
                  onDeleteDeal={onDeleteDeal}
                  onEditDeal={onEditDeal}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

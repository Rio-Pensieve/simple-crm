import React from 'react';
import { TrendingUp, TrendingDown, Percent, Wallet } from 'lucide-react';

export default function StatsHeader({ deals }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Total Pipeline (active deals - excludes 'lost')
  const activeDeals = deals.filter(d => d.status !== 'lost');
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);

  // 2. Expected Revenue (weighted by probability of winning)
  // Prospect: 10%, Proposal: 30%, Negotiation: 75%, Won: 100%
  const getProbability = (status) => {
    switch (status) {
      case 'prospect': return 0.10;
      case 'proposal': return 0.30;
      case 'negotiation': return 0.75;
      case 'won': return 1.00;
      default: return 0;
    }
  };

  const expectedRevenue = deals.reduce((sum, d) => {
    return sum + (d.value * getProbability(d.status));
  }, 0);

  // 3. Lost Value
  const lostDeals = deals.filter(d => d.status === 'lost');
  const totalLost = lostDeals.reduce((sum, d) => sum + d.value, 0);

  // 4. Win Rate (Won / (Won + Lost))
  const wonCount = deals.filter(d => d.status === 'won').length;
  const lostCount = lostDeals.length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  return (
    <div className="metrics-grid">
      <div className="metric-card glass">
        <div className="metric-icon-wrapper" style={{ color: 'var(--color-prospect)' }}>
          <Wallet size={24} />
        </div>
        <div className="metric-details">
          <span className="metric-label">Total Pipeline Aktif</span>
          <span className="metric-value">{formatCurrency(totalPipeline)}</span>
        </div>
      </div>

      <div className="metric-card glass">
        <div className="metric-icon-wrapper" style={{ color: 'var(--color-won)' }}>
          <TrendingUp size={24} />
        </div>
        <div className="metric-details">
          <span className="metric-label">Expected Revenue (Weighted)</span>
          <span className="metric-value">{formatCurrency(expectedRevenue)}</span>
        </div>
      </div>

      <div className="metric-card glass">
        <div className="metric-icon-wrapper" style={{ color: 'var(--color-lost)' }}>
          <TrendingDown size={24} />
        </div>
        <div className="metric-details">
          <span className="metric-label">Nilai Proyek Gugur (Lost)</span>
          <span className="metric-value">{formatCurrency(totalLost)}</span>
        </div>
      </div>

      <div className="metric-card glass">
        <div className="metric-icon-wrapper" style={{ color: 'var(--color-proposal)' }}>
          <Percent size={24} />
        </div>
        <div className="metric-details">
          <span className="metric-label">Win Rate</span>
          <span className="metric-value">{winRate}%</span>
        </div>
      </div>
    </div>
  );
}

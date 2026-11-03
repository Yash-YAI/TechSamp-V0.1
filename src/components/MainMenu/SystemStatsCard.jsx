import { Database, Server, Activity, Users } from 'lucide-react';

export default function SystemStatsCard({ stats, uptime, serverStatus }) {
  return (
    <div className="dashboard-card stats-overview-card">
      <div className="card-header">
        <h3 className="card-title">System & Database Status</h3>
        <span className="status-badge operational">
          <Activity size={12} style={{ marginRight: 4 }} />
          {serverStatus || 'Operational'}
        </span>
      </div>

      <div className="stats-kpi-grid">
        <div className="kpi-box">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="kpi-value">{stats?.totalEmployees || '—'}</div>
            <div className="kpi-label">Total Registered Users</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Database size={20} />
          </div>
          <div>
            <div className="kpi-value">Connected</div>
            <div className="kpi-label">eco_development DB</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Server size={20} />
          </div>
          <div>
            <div className="kpi-value">{uptime || 'Online'}</div>
            <div className="kpi-label">Server Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}


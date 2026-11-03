import { User, Briefcase, Building, Shield } from 'lucide-react';

export default function UserProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="dashboard-card profile-summary-card">
      <div className="card-header">
        <h3 className="card-title">Employee Profile</h3>
        <span className="status-badge active">Verified</span>
      </div>

      <div className="profile-banner">
        {user.face_photo ? (
          <img src={user.face_photo} alt={user.name} className="profile-large-avatar" />
        ) : (
          <div className="profile-large-placeholder">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <div className="profile-titles">
          <h2 className="profile-name">{user.eng_name || user.name}</h2>
          {user.kh_name && <p className="profile-kh-name">{user.kh_name}</p>}
          <p className="profile-role">{user.job_title || 'Employee'}</p>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="info-item">
          <div className="info-icon">
            <User size={16} />
          </div>
          <div>
            <div className="info-label">Employee Code</div>
            <div className="info-val">{user.emp_code || '—'}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <Building size={16} />
          </div>
          <div>
            <div className="info-label">Department</div>
            <div className="info-val">{user.dept_name || '—'}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <Briefcase size={16} />
          </div>
          <div>
            <div className="info-label">Section</div>
            <div className="info-val">{user.sect_name || '—'}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <Shield size={16} />
          </div>
          <div>
            <div className="info-label">Roles Count</div>
            <div className="info-val">{user.roles ? user.roles.length : 0} assigned</div>
          </div>
        </div>
      </div>

      {user.roles && user.roles.length > 0 && (
        <div className="roles-container">
          <div className="roles-label">Assigned Permissions & Roles:</div>
          <div className="roles-tags">
            {user.roles.map((role, idx) => (
              <span key={idx} className="role-chip">
                {typeof role === 'string' ? role : role.name || JSON.stringify(role)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


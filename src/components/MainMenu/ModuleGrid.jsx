import { Layers, ArrowRight } from 'lucide-react';

export default function ModuleGrid({ modules }) {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="modules-section">
      <div className="section-header">
        <h3 className="section-title">
          <Layers size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Available Portal Modules
        </h3>
        <span className="section-subtitle">Quick access to authorized systems</span>
      </div>

      <div className="modules-grid">
        {modules.map((mod) => (
          <div key={mod.id} className="module-card">
            <span className="module-category">{mod.category}</span>
            <h4 className="module-name">{mod.title}</h4>
            <p className="module-desc">{mod.desc}</p>
            <div className="module-footer">
              <span className="module-link">
                Open Module <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


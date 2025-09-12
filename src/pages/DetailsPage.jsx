import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/main.css';

function DetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const employee = location?.state?.employee ?? null;
  const rowKey = location?.state?.rowKey ?? null;

  if (!employee) {
    return (
      <div className="page-container">
        <div className="center" style={{ padding: 40 }}>
          <h3>No employee selected</h3>
          <p className="muted">Please go to the list page and select an employee to view details.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn-primary-sm" onClick={() => navigate('/list')}>Back to List</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2>Employee Details</h2>
          <p className="muted">Employee profile and actions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-cta" onClick={() => navigate('/list')}>Back</button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <div className="detail-label">Name</div>
          <div className="detail-value">{employee.name}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Job Title</div>
          <div className="detail-value">{employee.job}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">City</div>
          <div className="detail-value">{employee.city}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Employee ID</div>
          <div className="detail-value">{employee.id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Start Date</div>
          <div className="detail-value">{employee.startDate}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Salary</div>
          <div className="detail-value">{employee.salary}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Row Key</div>
          <div className="detail-value muted" title="Composite key used by UI">{rowKey ?? '—'}</div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
    
          <button
            className="btn-primary-sm"
            onClick={() => navigate('/photo', { state: { employee, rowKey } })}
          >
            Capture Photo
          </button>

          <button
            className="btn-outline"
            onClick={() => {
              
              const csv = [
                ['Name','Job','City','ID','Start Date','Salary'],
                [employee.name, employee.job, employee.city, employee.id, employee.startDate, employee.salary]
              ].map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');

              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${(employee.name || 'employee')}-row.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;

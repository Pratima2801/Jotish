import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/api';
import TableList from '../components/TableList';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';

function ListPage() {
  const [employees, setEmployees] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTableData()
      .then(data => {
        if (!mounted) return;
        setEmployees(data);
        setError('');
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setError('Failed to load data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const filtered = employees.filter(emp => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      (emp.name ?? '').toLowerCase().includes(term) ||
      (emp.job ?? '').toLowerCase().includes(term) ||
      (emp.city ?? '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="list-header">
        <h2>Employees</h2>
        <div className="controls">
          <input
            className="search-input"
            placeholder="Search by name, job or city..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-cta" onClick={() => navigate('/graph')}>
            Salary Chart
          </button>
          <button className="btn-cta" onClick={() => navigate('/map')}>
            City Map
          </button>
          <button className="btn-warm" onClick={() => { navigate('/login'); }}>
            Logout
          </button>
        </div>
      </div>

      {loading && <div className="center">Loading data...</div>}
      {error && <div className="error center">{error}</div>}

      {!loading && !error && (
        <TableList rows={filtered} />
      )}
    </div>
  );
}

export default ListPage;

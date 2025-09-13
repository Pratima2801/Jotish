import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

function parseSalaryToNumber(salaryStr) {
  if (salaryStr === undefined || salaryStr === null) return 0;
  const digits = String(salaryStr).replace(/[^0-9.-]+/g, '');
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n);
}

export default function GraphPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    fetchTableData()
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res) ? res : (res?.data ?? []);
        setUsedFallback(Array.isArray(res) ? false : Boolean(res?.fromFallback));

        const prepared = data.map((e, i) => {
          const salaryNumber =
            (typeof e.salaryNumber === 'number' && !Number.isNaN(e.salaryNumber))
              ? e.salaryNumber
              : parseSalaryToNumber(e.salary);
          return {
            id: `${e.id ?? 'noid'}-${i}`,
            name: e.name ?? `#${i + 1}`,
            salary: salaryNumber
          };
        });
        
        const first10 = prepared.slice(0, 10);
        setRows(first10);
      })
      .catch((err) => {
        console.error('GraphPage fetch error', err);
        setError('Failed to load chart data');
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18 }}>
        <div>
          <h2>Salary Bar Chart — First 10 Employees</h2>
          <p className="muted">Salaries plotted from the dataset (hover a bar to see value).</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-cta" onClick={() => navigate('/list')}>Back to List</button>
        </div>
      </div>

      {usedFallback && !loading && (
        <div style={{ background: '#fff7e6', border: '1px solid #ffd89b', padding: 10, borderRadius: 8, marginBottom: 12, color: '#6a4a00' }}>
          ⚠️ Showing fallback/sample data.
        </div>
      )}

      {loading && <div className="center">Loading chart data...</div>}
      {error && <div className="error center">{error}</div>}

      {!loading && !error && (
        <div className="table-card" style={{ padding: 18 }}>
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={90} 
                />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="salary" name="Salary" fill="#6a5acd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

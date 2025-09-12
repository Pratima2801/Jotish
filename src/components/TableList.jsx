import React from 'react';
import { useNavigate } from 'react-router-dom';

function makeRowKey(emp, idx) {
  
  const id = emp?.id ?? 'no-id';
  const name = (emp?.name ?? 'no-name').replace(/\s+/g, '_');
  return `${id}-${name}-${idx}`;
}

function TableList({ rows = [] }) {
  const navigate = useNavigate();

  if (!rows.length) {
    return <div className="center muted">No employees to show.</div>;
  }

  return (
    <div className="table-card">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title</th>
            <th>City</th>
            <th>ID</th>
            <th>Start Date</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((emp, idx) => {
            const rowKey = makeRowKey(emp, idx); 
            return (
            <tr key={rowKey}>
              <td>{emp.name}</td>
              <td>{emp.job}</td>
              <td>{emp.city}</td>
              <td>{emp.id}</td>
              <td>{emp.startDate}</td>
              <td>{emp.salary}</td>
              <td>
                <button
                  className="btn-primary-sm"
                  onClick={() => navigate('/details', { state: { employee: emp, rowKey } })}
                >
                  View Details
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableList;

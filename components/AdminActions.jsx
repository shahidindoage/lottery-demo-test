'use client';

import React from 'react';

export default function AdminActions() {
  // 🔹 Export CSV
  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) {
        alert('⚠️ No data found or error generating CSV.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'submissions.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to export data.');
    }
  };

  // 🔹 Clear All Entries
  const handleClear = async () => {
    const confirmed = confirm('⚠️ Are you sure you want to delete all entries?');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/clear', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('✅ All entries deleted successfully.');
        window.location.reload();
      } else {
        alert('❌ Failed to delete entries.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while deleting.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={handleExport}
        style={{
          background: '#007bff',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ⬇️ Export CSV
      </button>

      <button
        onClick={handleClear}
        style={{
          background: '#d9534f',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        🗑️ Clear Entries
      </button>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AdminMenu({ role }) {
  const [open, setOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const menuRef = useRef(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(''); // for username


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  // Export CSV
  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) return alert('⚠️ Failed to export.');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'submissions.csv';
      a.click();
      a.remove();
      setOpen(false);
    } catch {
      alert('Error exporting data.');
    }
  };

  // Clear all entries
  const handleClear = async () => {
    if (!confirm('⚠️ Are you sure you want to delete all entries?')) return;
    try {
      const res = await fetch('/api/admin/clear', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('✅ All entries deleted successfully.');
        window.location.reload();
      } else {
        alert('❌ Failed to delete entries.');
      }
    } catch {
      alert('Server error while deleting.');
    }
  };

  // Logout
  const handleLogout = async () => {
  try {
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/admin/login';
    } else {
      alert('Logout failed');
    }
  } catch {
    alert('Logout failed');
  }
};


  // Reset Password
  const handleResetPassword = async () => {
    if (!currentPass || !newPass || !confirmPass) return alert('Fill all fields.');
    if (newPass !== confirmPass) return alert('New passwords do not match.');
    setLoading(true);

    try {
     const res = await fetch('/api/admin/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: selectedUser || undefined, currentPass, newPass }),
});

      const data = await res.json();
      if (res.ok) {
        alert('✅ Password reset successfully!');
        setShowResetModal(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch {
      alert('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Admin menu"
        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#d6af66' }}
      >
        ⋮
      </button>

      {open && (
        <div style={dropdownStyle}>
          <DropdownItem icon="⭐" text="Game Page" as={Link} href="/admin/dashboard/game" onClick={() => setOpen(false)} />
           <DropdownItem icon="🏆" text="Winners Page" as={Link} href="/winners" onClick={() => setOpen(false)} />
          <DropdownItem icon="⬇️" text="Export CSV" onClick={handleExport} />
          < DropdownItem1 icon="🗑️" text="Clear Entries" danger onClick={handleClear} />
             <div style={dividerStyle}></div>
            {role === 'OWNER' && (
  <DropdownItem icon="🔑" text="Reset Password" onClick={() => setShowResetModal(true)} />
)}
{role === 'OWNER' && (
  <DropdownItem icon="📑" text="Export Logs" as={Link} href="/admin/export-logs" onClick={() => setOpen(false)}/>
)}
 < DropdownItem icon="🚪" text="Logout" onClick={handleLogout} />
        </div>
      )}

      {/* Reset Password Modal */}
     
{showResetModal && (
  <div style={modalOverlay}>
    <div style={modalStyle}>
      <h3>Reset Password</h3>

      {/* Username input for Owner */}
      {role === 'OWNER' && (
        <input
          type="text"
          placeholder="Username"
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={inputStyle}
        />
      )}

      <input
        type="password"
        placeholder="Current Password"
        value={currentPass}
        onChange={(e) => setCurrentPass(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
        <button onClick={() => setShowResetModal(false)} style={buttonStyleSecondary}>Cancel</button>
        <button onClick={handleResetPassword} style={buttonStylePrimary} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

function DropdownItem({ icon, text, onClick, href, as: Component = 'button', danger = false }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: danger ? '#ff6b6b' : '#fff',
    background: 'transparent',
    border: 'none',
    textDecoration: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'playfair-display-v2',
    fontWeight: '100',
  };

  const hoverStyle = { background: 'rgba(255,255,255,0.08)', transform: 'translateX(3px)' };
  const [hover, setHover] = React.useState(false);

  return (
    <Component
      href={href}
      onClick={onClick}
      style={{ ...baseStyle, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
      <span>{text}</span>
    </Component>
  );
}

function DropdownItem1({ icon, text, onClick, href, as: Component = 'button', danger = false }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: danger ? '#ff6b6b' : '#fff',
    background: 'transparent',
    border: 'none',
    textDecoration: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'playfair-display-v2',
    fontWeight: '100',
    marginTop:"-20px"
  };

  const hoverStyle = { background: 'rgba(255,255,255,0.08)', transform: 'translateX(3px)' };
  const [hover, setHover] = React.useState(false);

  return (
    <Component
      href={href}
      onClick={onClick}
      style={{ ...baseStyle, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
      <span>{text}</span>
    </Component>
  );
}

const dropdownStyle = {
  position: 'absolute',
  right: 0,
  top: '110%',
  background: '#1e1e1e',
  border: '1px solid #333',
  borderRadius: 10,
  width: 190,
  overflow: 'hidden',
  boxShadow: '0 8px 18px rgba(0,0,0,0.45)',
  zIndex: 1000,
  fontFamily: 'playfair-display-v2',
};

const dividerStyle = { height: 1, background: '#333', margin: '4px 0' };

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

const modalStyle = {
  background: '#222', padding: 20, borderRadius: 10, width: 320, display: 'flex', flexDirection: 'column', gap: 8
};

const inputStyle = {
  padding: '8px 10px', borderRadius: 6, border: '1px solid #555', background: '#111', color: '#fff'
};

const buttonStylePrimary = {
  padding: '6px 12px', borderRadius: 6, border: 'none', background: '#d6af66', color: '#000', cursor: 'pointer'
};
const buttonStyleSecondary = {
  padding: '6px 12px', borderRadius: 6, border: '1px solid #555', background: '#222', color: '#fff', cursor: 'pointer'
};

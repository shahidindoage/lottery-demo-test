// app/admin/export-logs/page.jsx
import { prisma } from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ExportLogsPage() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('admin_auth')?.value;

  if (!adminAuth) redirect('/admin/login');

  const logs = await prisma.exportLogs.findMany({
    orderBy: { exportedAt: 'desc' },
  });

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#0f0f0f',
      padding: 30,
      color: '#fff',
      flexDirection: 'column',
      gap: 20
    }}>
      <div style={{
        background: '#0f0f0f',
        backdropFilter: 'blur(16px)',
        padding: 36,
        borderRadius: 16,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        textAlign: 'center',
      }}>
        <h2 style={{
          color: '#d6af66',
          marginBottom: 20,
          fontFamily: "PP-NEUE",
          fontSize: 32,
          fontWeight: "100"
        }}>Export Logs</h2>

        {logs.length === 0 ? (
          <p style={{ color: '#ccc', fontSize: 14 }}>No export logs found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: "playfair-display-v2",
              fontWeight: 100
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={thStyle}>IP Address</th>
                  <th style={thStyle}>User Agent</th>
                  <th style={thStyle}>Exported At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={tdStyle}>{log.ipAddress}</td>
                    <td style={tdStyle}>{log.userAgent}</td>
                    <td style={tdStyle}>{new Date(log.exportedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'center',
  padding: '12px 8px',
  background: '#1e1e1e',
  color: '#d6af66',
  fontSize: 14
};

const tdStyle = {
  padding: '12px 8px',
  color: '#fff',
  fontSize: 14,
  textAlign: 'center',
};

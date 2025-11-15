import { prisma } from '../../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
// import AdminMenu from '@/components/AdminMenu';
import Image from 'next/image';
import AdminMenu from '../../../components/AdminMenu';

// ✅ Static list of known country codes (reference)
const staticCountryCodes = [
  '+91', '+7', '+1', '+44', '+971', '+93', '+355', '+213',
  '+376', '+244', '+54', '+374', '+43', '+994', '+973', '+880',
  '+375', '+32', '+591', '+387', '+55', '+359', '+226', '+257',
  '+855', '+237', '+236', '+235', '+56', '+86', '+57', '+269',
  '+243', '+242', '+682', '+506', '+225', '+385', '+53', '+357',
  '+420', '+45', '+253', '+20', '+503', '+240', '+291', '+372',
  '+251', '+298', '+679', '+358', '+33', '+594', '+689', '+241',
  '+220', '+995', '+49', '+233', '+350', '+30', '+299', '+502',
  '+44', '+224', '+245', '+595', '+509', '+504', '+852', '+36',
  '+62', '+98', '+964', '+353', '+972', '+39', '+81', '+962',
  '+82', '+965', '+60', '+52', '+234', '+31', '+64', '+47',
  '+48', '+351', '+974', '+40', '+966', '+65', '+27', '+34',
  '+46', '+41', '+886', '+66', '+90', '+84', '+998'
];

export default async function AdminDashboard({ searchParams }) {
  // ✅ Auth
   // Cookies in server components are async
  // Cookies in server components
  const cookieStore = cookies();
  const adminAuthCookie = cookieStore.get('admin_auth'); // this is actually ok in server component
  // ✅ But to be safe, in Next.js 14+ they suggest:
  // const adminAuthCookie = await cookieStore.get('admin_auth'); 

  if (!adminAuthCookie?.value) {
    redirect('/admin/login');
  }

  const adminAuth = JSON.parse(adminAuthCookie.value); // contains { username, role }

  // ✅ Now you can use adminAuth.role to check OWNER vs MANAGER
  const isOwner = adminAuth.role === 'OWNER';

  // Fetch submissions
  const allSubmissions = await prisma.lotterySubmission.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // ✅ Extract valid distinct country codes
  const dynamicCountryCodes = Array.from(
    new Set(
      allSubmissions
        .map((s) => {
          if (!s.phone) return null;
          const foundCode = staticCountryCodes.find((code) =>
            s.phone.startsWith(code)
          );
          return foundCode || null;
        })
        .filter(Boolean)
    )
  ).sort();

  // ✅ Filter
  const countryFilter = searchParams?.countryCode
    ? { phone: { startsWith: searchParams.countryCode } }
    : {};

  const submissions = await prisma.lotterySubmission.findMany({
    where: countryFilter,
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="admin-wrapper">
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,}} className='logo-doremi'>
                  <Image src="/logo.PNG" alt="Logo" width={200} height={200} priority />
                </div>
      <div className="admin">
        
        <h1 className='admin-title' style={{fontFamily:"PP-NEUE"}}> Admin Dashboard</h1>
        <div className="subtitle" style={{fontFamily:"playfair-display-v2" }}>
          Manage all lottery submissions and control registration access.
        </div>

        {/* 🔘 Header Controls */}
        <div className="logout-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* 🔽 Country Code Filter */}
          {/* <form method="GET">
            <label htmlFor="countryCode" style={{ marginRight: 8,fontFamily:"playfair-display-v2"  }} className='filter-label' >
              Filter by Country Code:
            </label>
            <select
              name="countryCode"
              id="countryCode"
              defaultValue={searchParams?.countryCode || ''}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #555',
                background: '#222',
                color: '#fff',
                fontFamily:"playfair-display-v2" 
              }}
            >
              <option value="" style={{fontFamily:"playfair-display-v2" }}>All</option>
              {dynamicCountryCodes.map((code) => (
                <option key={code} value={code} style={{fontFamily:"playfair-display-v2" }}>
                  {code}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                marginLeft: 8,
                padding: '6px 12px',
                borderRadius: 6,
                background: '#d6af66',
                border: 'none',
                cursor: 'pointer',
                fontFamily:"playfair-display-v2" 
              }}
            >
              Filter
            </button>
          </form> */}

          {/* ✅ Toggle Registration Button */}
          {/* <form
            action="/api/admin/toggle-registration"
            method="POST"
            style={{ marginLeft: 'auto' }}
          >
            <input type="hidden" name="allow" value={allowRegistration ? 'false' : 'true'} />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                background: allowRegistration ? '#d9534f' : '#5cb85c',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {allowRegistration ? '🔒 Close Registration' : '🟢 Open Registration'}
            </button>
          </form> */}

     
 <AdminMenu role={adminAuth.role} /> 



          
        </div>

        {/* 📋 Table */}
        <table
          border="1"
          cellPadding="8"
          style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20,fontFamily:"playfair-display-v2" }}
        >
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
             
              <th>Terms</th>
              <th>Winner</th>
              <th>Card Number</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No submissions found
                </td>
              </tr>
            )}
            {submissions.map((s) => (
              <tr key={s.id} >
                <td>{s.uniqueId}</td>
                <td>{s.name}</td>
                <td>{s.phone || '-'}</td>
                <td>{s.email}</td>
                <td>{s.accepted_terms ? 'Yes' : 'No'}</td>
                <td>{s.winner === 1 ? '✅' : '❌'}</td>
                <td>{s.cardNumber || '-'}</td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

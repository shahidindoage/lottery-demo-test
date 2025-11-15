'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <button
     className='logout-btn'
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

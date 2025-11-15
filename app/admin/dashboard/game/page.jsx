// app/admin/flip/page.jsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FlipPage from '../../../../components/FlipPage'; // if your game is a separate component file

export default async function AdminFlipGamePage() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('admin_auth');

  // 🚫 Redirect if not logged in as admin
  if (!adminAuth) redirect('/admin/login');

  return <FlipPage />;
}

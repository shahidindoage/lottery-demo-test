import { cookies } from 'next/headers';

export function setUserSession(id) {
  cookies().set('lottery_user', id.toString(), { path: '/', maxAge: 3600 });
}

export function getUserSession() {
  const id = cookies().get('lottery_user')?.value;
  return id ? parseInt(id) : null;
}

export function clearUserSession() {
  cookies().delete('lottery_user');
}

export function setAdminSession() {
  cookies().set('admin_auth', 'true', { path: '/', maxAge: 3600 });
}

export function isAdminLoggedIn() {
  return cookies().get('admin_auth')?.value === 'true';
}

export function clearAdminSession() {
  cookies().delete('admin_auth');
}

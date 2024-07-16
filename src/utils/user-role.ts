'use server';

import { cookies } from 'next/headers';

const ROLE_COOKIE_NAME = 'user_role';

export async function setUserRoleCookie(role: 'merchant' | 'customer' | 'admin') {
  cookies().set(ROLE_COOKIE_NAME, role, {
    path: '/',
    secure: true,
    httpOnly: true,
    // sameSite: 'strict',
  });
}

export async function getUserRoleFromCookie() {
  return cookies().get(ROLE_COOKIE_NAME)?.value;
}

export async function removeUserRoleCookie() {
  cookies().delete(ROLE_COOKIE_NAME);
}

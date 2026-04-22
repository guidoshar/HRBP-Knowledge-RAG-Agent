import { SignJWT, jwtVerify } from 'jose';

export type UserRole = 'admin' | 'hrbp_manager' | 'employee';

export interface MockUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  dept: string;
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  name: string;
  dept: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: 1, username: 'admin', password: 'Admin@2026', role: 'admin', name: '系统管理员', dept: 'IT' },
  { id: 2, username: 'hrbp', password: 'HRBP@2026', role: 'hrbp_manager', name: '王芳', dept: 'HR' },
  { id: 3, username: 'emp001', password: 'Emp@2026', role: 'employee', name: '张三', dept: '研发部' },
];

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-please-min-32';
const secret = new TextEncoder().encode(JWT_SECRET);

export function findMockUser(username: string, password: string): MockUser | null {
  const user = MOCK_USERS.find((item) => item.username === username && item.password === password);
  return user || null;
}

export async function signToken(user: MockUser): Promise<string> {
  return new SignJWT({
    username: user.username,
    role: user.role,
    name: user.name,
    dept: user.dept,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: String(payload.sub || ''),
      username: String(payload.username || ''),
      role: (payload.role as UserRole) || 'employee',
      name: String(payload.name || ''),
      dept: String(payload.dept || ''),
    };
  } catch {
    return null;
  }
}

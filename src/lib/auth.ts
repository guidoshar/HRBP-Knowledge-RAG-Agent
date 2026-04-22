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
  iss: string;
  aud: string;
}

export const JWT_ISSUER  = 'sharkninja-hrbp';
export const JWT_AUDIENCE = 'sharkninja-hrbp-users';

export const MOCK_USERS: MockUser[] = [
  { id: 1, username: 'admin',  password: 'Admin@2026', role: 'admin',        name: '系统管理员', dept: 'IT' },
  { id: 2, username: 'hrbp',   password: 'HRBP@2026',  role: 'hrbp_manager', name: '王芳',       dept: 'HR' },
  { id: 3, username: 'emp001', password: 'Emp@2026',    role: 'employee',     name: '张三',       dept: '研发部' },
];

const JWT_SECRET_RAW = process.env.JWT_SECRET ?? 'sharkninja-hrbp-secret-key-change-in-prod-32c';
const secret = new TextEncoder().encode(JWT_SECRET_RAW);

export function findMockUser(username: string, password: string): MockUser | null {
  return MOCK_USERS.find(u => u.username === username && u.password === password) ?? null;
}

export async function signToken(user: MockUser): Promise<string> {
  return new SignJWT({
    username: user.username,
    role:     user.role,
    name:     user.name,
    dept:     user.dept,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(String(user.id))
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setNotBefore('0s')
    .setExpirationTime('8h')
    .setJti(`${user.id}-${Date.now()}`)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer:   JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS256'],
    });
    return {
      sub:      String(payload.sub ?? ''),
      username: String(payload.username ?? ''),
      role:     (payload.role as UserRole) ?? 'employee',
      name:     String(payload.name ?? ''),
      dept:     String(payload.dept ?? ''),
      iss:      String(payload.iss ?? ''),
      aud:      String(payload.aud ?? ''),
    };
  } catch {
    return null;
  }
}

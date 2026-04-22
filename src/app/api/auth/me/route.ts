import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('hrbp_token')?.value;
  if (!token) {
    return NextResponse.json({ message: '未登录' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: 'Token 无效或已过期' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      name: payload.name,
      dept: payload.dept,
    },
  });
}

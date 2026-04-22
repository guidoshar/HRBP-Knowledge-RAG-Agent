import { NextRequest, NextResponse } from 'next/server';
import { findMockUser, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '').trim();

    if (!username || !password) {
      return NextResponse.json({ message: '用户名和密码不能为空' }, { status: 400 });
    }

    const user = findMockUser(username, password);
    if (!user) {
      return NextResponse.json({ message: '用户名或密码错误' }, { status: 401 });
    }

    const token = await signToken(user);
    const response = NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        dept: user.dept,
      },
    });

    response.cookies.set('hrbp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || '登录失败' }, { status: 500 });
  }
}

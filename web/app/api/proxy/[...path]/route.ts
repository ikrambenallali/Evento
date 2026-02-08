import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(req: NextRequest, { params }: any) {
  return handleProxy(req, params.path, 'GET');
}

export async function POST(req: NextRequest, { params }: any) {
  return handleProxy(req, params.path, 'POST');
}

export async function PUT(req: NextRequest, { params }: any) {
  return handleProxy(req, params.path, 'PUT');
}

export async function DELETE(req: NextRequest, { params }: any) {
  return handleProxy(req, params.path, 'DELETE');
}

async function handleProxy(
  req: NextRequest,
  path: string[],
  method: string
) {
  const token = req.cookies.get('access_token')?.value;

  // 🔐 Protection
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const backendResponse = await fetch(
    `${BACKEND_URL}/${path.join('/')}`,
    {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? await req.text() : undefined,
    }
  );

  const data = await backendResponse.text();

  return new NextResponse(data, {
    status: backendResponse.status,
  });
}

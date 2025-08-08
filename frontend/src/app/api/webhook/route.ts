import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // important pour fetch côté serveur

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge || '', { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('WA webhook =>', JSON.stringify(body, null, 2));
  return NextResponse.json({ received: true });
}

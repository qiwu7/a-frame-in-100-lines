import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  let currency = '';
  let imageSrc = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (message?.button === 1) {
    currency = 'bitcoin';
    imageSrc = `${NEXT_PUBLIC_URL}/${currency}.jpeg`;
  } else if (message?.button === 2) {
    currency = 'ethereum';
    imageSrc = `${NEXT_PUBLIC_URL}/${currency}.jpeg`;
  } else if (message?.button === 3) {
    currency = 'solana';
    imageSrc = `${NEXT_PUBLIC_URL}/${currency}.jpeg`;
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `You love ${currency} because: ${text} 🌲🌲`,
        },
      ],
      image: {
        src: imageSrc,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

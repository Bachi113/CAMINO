import config from '@/config';
import { NextResponse } from 'next/server';
import client from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = client(accountSid, authToken, {
  autoRetry: true,
  maxRetries: 3,
});

export async function POST(req: Request) {
  try {
    // Parse the request body to extract phone and name
    const { phone, message } = await req.json();

    const response = await twilio.messages.create({
      to: phone,
      body: message,
      messagingServiceSid: config.twilio.messagingServiceSid,
    });

    // TODO: handle error response
    console.log(response);

    return NextResponse.json({ message: `SMS sent to ${phone}` }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message ?? `${error}` }, { status: 400 });
  }
}

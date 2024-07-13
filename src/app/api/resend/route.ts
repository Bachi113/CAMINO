import config from '@/config';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the Resend instance with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Parse the request body to extract email and name
    const { email, subject, emailBody } = await req.json();

    // Send the welcome email using the Resend instance
    const { error } = await resend.emails.send({
      from: config.resend.senderEmailAddress,
      // to: email, // For multiple addresses, send as an array of strings. Max 50. It will not send emails to custom emails until you configure your domain in Resend.
      // TODO: remove hardcoded email address
      to: 'it@savex.me',
      subject,
      html: emailBody, // Add email body in HTML format
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: `Email sent to ${email}` }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: error.message ?? `${error}` }, { status: 400 });
  }
}

// Check out the documentation for more details: https://resend.com/docs/send-with-nextjs.

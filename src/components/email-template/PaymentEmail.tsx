import config from '@/config';

function paymentLinkEmail(
  name: string,
  amount: string,
  quantity: number,
  product: string,
  paymentLink: string
) {
  return `
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
      <div style="padding: 20px 0 48px;">
        <img
          src='${config.app.url}/logo.png'
          width='100'
          height='60'
          alt='Camino'
          style="display: block; object-fit: contain;"
        />
        <p style="font-size: 16px; line-height: 26px;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 26px;">We've prepared the subscription link for <strong>${product}</strong> of the Amount <strong>${amount}</strong>, Quantity <strong>${quantity}</strong>. You can easily complete your payment by clicking the button below.</p>
        <div style="width: 100%; text-align: center;">
          <a href='${paymentLink}' style="background-color: #5F51E8; border-radius: 6px; color: #fff; font-size: 16px; text-decoration: none; text-align: center; display: block; width: 100%; padding: 12px 0; margin-top: 10px;">
            Pay Now
          </a>
        </div>
        <p style="font-size: 16px; line-height: 26px;">
          If you have any questions about this invoice, please don't hesitate to contact our support team.
        </p>
        <p style="font-size: 16px; line-height: 26px;">
          <br />
          Thank you,
          <br />
          The Camino team
        </p>
        <hr style="border-color: #cccccc; margin: 20px 0;" />
        <p style="color: #8898aa; font-size: 12px;">470 Noor Ave STE B #1148, South San Francisco, CA 94080</p>
      </div>
    </div>
  `;
}

export default paymentLinkEmail;

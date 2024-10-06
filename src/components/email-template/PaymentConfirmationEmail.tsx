import config from '@/config';

function paymentConfirmationEmail(
  name: string,
  amount: string,
  product: string,
  invoiceLink?: string | null
) {
  const invoiceButton =
    invoiceLink &&
    `
    <div style="width: 100%; text-align: center;">
      <a href='${invoiceLink}' style="background-color: #5F51E8; border-radius: 6px; color: #fff; font-size: 16px; text-decoration: none; text-align: center; display: block; width: 100%; padding: 12px 0; margin-top: 10px;">
        View Invoice
      </a>
    </div>
  `;

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
        <p style="font-size: 16px; line-height: 26px;">Congratualtions ${name} 🎉</p>
        <p style="font-size: 16px; line-height: 26px;">We have received your payment of <strong>${amount}</strong> for the <strong>${product}</strong> subscription.</p>
        <p style="font-size: 16px; line-height: 26px;">Your payment has been processed successfully, and your subscription is now active.</p>
        ${invoiceButton}
        <p style="font-size: 16px; line-height: 26px;">
          If you have any questions about this payment or your subscription, please don't hesitate to contact our support team.
        </p>
        <p style="font-size: 16px; line-height: 26px;">
          <br />
          Thank you for choosing Camino,
          <br />
          The Camino team
        </p>
        <hr style="border-color: #cccccc; margin: 20px 0;" />
        <p style="color: #8898aa; font-size: 12px;">470 Noor Ave STE B #1148, South San Francisco, CA 94080</p>
      </div>
    </div>
  `;
}

export default paymentConfirmationEmail;

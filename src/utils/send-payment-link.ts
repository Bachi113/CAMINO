import paymentLinkEmail from '@/components/email-template/PaymentEmail';
import config from '@/config';
import axios from 'axios';
import getSymbolFromCurrency from 'currency-symbol-map';

export type TypeSendPaymentLinkToCustomer = {
  customerName: string;
  productName: string;
  currency: string;
  price: string;
  paymentLink: string;
  customerEmail?: string;
  customerPhone?: string;
};

export const sendPaymentLinkToCustomer = async (data: TypeSendPaymentLinkToCustomer) => {
  const { customerName, productName, currency, price, paymentLink, customerEmail, customerPhone } = data;

  const amount = `${getSymbolFromCurrency(currency)}${price}`;

  // Send payment link to the customer via email
  if (customerEmail) {
    await sendPaymentLinkViaEmail(customerName, customerEmail, productName, amount, paymentLink);
  }

  // TODO: Uncomment this code after implementing the SMS service w/ Twilio
  // // Send payment link to the customer via SMS
  // if (customerPhone) {
  //   await sendPaymentLinkViaSMS(customerName, customerPhone, productName, amount, paymentLink);
  // }
};

// Send payment link to the customer via email
const sendPaymentLinkViaEmail = async (
  customerName: string,
  customerEmail: string,
  productName: string,
  amount: string,
  paymentLink: string
) => {
  const emailBody = paymentLinkEmail(customerName!, amount, productName!, paymentLink);
  const subject = `Payment Link for ${productName} - ${config.app.name}`;

  await axios.post('/api/resend', { email: customerEmail, subject, emailBody });
};

// Send payment link to the customer via SMS
const sendPaymentLinkViaSMS = async (
  customerName: string,
  customerPhone: string,
  productName: string,
  amount: string,
  paymentLink: string
) => {
  const message = `Hi ${customerName},\n\nHere is the payment link for ${productName} - ${amount}:\n${paymentLink}\n\nPlease go to the above link and complete your payment to start the subscription.\nIf you have any questions about this invoice, please don't hesitate to contact our support team.\n\nThank you,\nThe Camino team`;

  await axios.post('/api/send-sms', { phone: customerPhone, message });
};

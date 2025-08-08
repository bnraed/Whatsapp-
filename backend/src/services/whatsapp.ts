import axios from 'axios';

export const sendWhatsAppMessage = async (
  phoneNumberId: string,
  accessToken: string,
  to: string,
  message: string
) => {
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

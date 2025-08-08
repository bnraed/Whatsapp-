import { FastifyInstance } from 'fastify';
import { WhatsAppConfig } from '../models/WhatsAppConfig';
import { authMiddleware } from '../middleware/auth';

import axios from 'axios';

export const sendWhatsAppMessage = async (phoneNumberId: string, accessToken: string, to: string, message: string) => {
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  return axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export default async function whatsappRoutes(app: FastifyInstance) {
  // Enregistrer les credentials WhatsApp d’une entreprise
  app.post('/connect', { preHandler: [authMiddleware] }, async (req, reply) => {
    try {
      const { appId, appSecret, accessToken, phoneNumberId, businessAccountId } = req.body as any;
      const user = (req as any).user;

      const config = await WhatsAppConfig.findOneAndUpdate(
        { company: user.company._id },
        { appId, appSecret, accessToken, phoneNumberId, businessAccountId, company: user.company._id },
        { new: true, upsert: true }
      );

      return { message: 'WhatsApp connecté avec succès', config };
    } catch (error) {
      return reply.status(500).send({ error: 'Erreur lors de la connexion WhatsApp' });
    }
  });
}

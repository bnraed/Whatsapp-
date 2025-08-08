import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth';
import { WhatsAppConfig } from '../models/WhatsAppConfig';
import { sendWhatsAppMessage } from '../services/whatsapp';

export default async function messageRoutes(app: FastifyInstance) {
  app.post('/send', { preHandler: [authMiddleware] }, async (req, reply) => {
    try {
      const { to, message } = req.body as any;
      const user = (req as any).user;

      // Récupérer la configuration WhatsApp de l'entreprise
      const config = await WhatsAppConfig.findOne({ company: user.company._id });
      if (!config) return reply.status(400).send({ error: 'WhatsApp non configuré' });

      // Envoyer le message via l'API WhatsApp Cloud
      const result = await sendWhatsAppMessage(
        config.phoneNumberId,
        config.accessToken,
        to,
        message
      );

      return { success: true, result };
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erreur lors de l\'envoi du message' });
    }
  });
}

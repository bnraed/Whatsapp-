import { FastifyInstance } from 'fastify';

interface WebhookQuery {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

export default async function webhookRoutes(app: FastifyInstance) {
  // Vérification du Webhook (appelé par Meta lors de la configuration)
  app.get<{ Querystring: WebhookQuery }>('/webhook', async (req, reply) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'monTokenWebhook';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return reply.status(200).send(challenge);
    } else {
      return reply.status(403).send('Erreur de vérification');
    }
  });

  // Réception des événements WhatsApp (messages entrants, statuts, etc.)
  app.post('/webhook', async (req, reply) => {
    console.log('Webhook reçu:', req.body);
    return reply.status(200).send('EVENT_RECEIVED');
  });
}

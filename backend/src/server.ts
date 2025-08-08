import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import webhookRoutes from './routes/webhook';
import messageRoutes from './routes/message';

dotenv.config();

const app = Fastify({ logger: true });

app.register(webhookRoutes, { prefix: '/api' });
app.register(messageRoutes, { prefix: '/api/messages' });
// Plugins globaux
app.register(cors);
app.register(helmet);
app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

// Enregistrement des routes
app.register(authRoutes, { prefix: '/api/auth' });

app.get('/', async () => {
  return { status: 'Backend is running 🚀' };
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp_platform');
    await app.listen({ port: 4000 });
    console.log('Server running on http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

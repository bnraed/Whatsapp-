import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/Users';

export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    const user = await User.findById(decoded.userId).populate('company');
    if (!user) return reply.status(401).send({ error: 'Utilisateur invalide' });

    (req as any).user = user; // attache l’utilisateur à la requête
  } catch (err) {
    return reply.status(401).send({ error: 'Token invalide' });
  }
};

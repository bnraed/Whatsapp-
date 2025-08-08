import { FastifyInstance } from 'fastify';
import { Company } from '../models/Company';
import { User } from '../models/Users';
import { generateToken } from '../utils/jwt';

export default async function authRoutes(app: FastifyInstance) {
  // Enregistrer une entreprise + admin
  app.post('/register', async (req, reply) => {
    try {
      const { companyName, name, email, password } = req.body as any;
      const company = await Company.create({ name: companyName });
      const user = await User.create({ name, email, password, company: company._id, role: 'admin' });
      const token = generateToken({ userId: user._id, companyId: company._id });
      return { token, company, user };
    } catch (error) {
      return reply.status(500).send({ error: 'Erreur lors de l\'inscription' });
    }
  });

  // Login
  app.post('/login', async (req, reply) => {
    try {
      const { email, password } = req.body as any;
      const user = await User.findOne({ email }).populate('company');
      if (!user) return reply.status(401).send({ error: 'Utilisateur non trouvé' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return reply.status(401).send({ error: 'Mot de passe incorrect' });

      const token = generateToken({ userId: user._id, companyId: user.company._id });
      return { token, user };
    } catch (error) {
      return reply.status(500).send({ error: 'Erreur lors de la connexion' });
    }
  });
}

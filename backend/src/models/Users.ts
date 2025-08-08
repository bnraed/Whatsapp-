import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface de base pour l'utilisateur
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'operator';
  company: Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

// Interface quand company est peuplé
export interface IUserPopulated extends Omit<IUser, 'company'> {
  company: {
    _id: string;
    name: string;
    domain?: string;
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'operator'], default: 'admin' },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
});

// Hash password avant save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', UserSchema);

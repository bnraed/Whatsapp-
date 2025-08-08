import { Schema, model, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain?: string;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  domain: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Company = model<ICompany>('Company', CompanySchema);

import { Schema, model, Document, Types } from 'mongoose';

export interface IWhatsAppConfig extends Document {
  company: Types.ObjectId;
  appId: string;
  appSecret: string;
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
}

const WhatsAppConfigSchema = new Schema<IWhatsAppConfig>({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  appId: { type: String, required: true },
  appSecret: { type: String, required: true },
  accessToken: { type: String, required: true },
  phoneNumberId: { type: String, required: true },
  businessAccountId: { type: String, required: true }
});

export const WhatsAppConfig = model<IWhatsAppConfig>('WhatsAppConfig', WhatsAppConfigSchema);

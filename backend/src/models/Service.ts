import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  ctaLabel?: string;
  ctaLink?: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    icon: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    ctaLabel: { type: String, default: "", trim: true, maxlength: 40 },
    ctaLink: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ visible: 1, order: 1 });

export const Service = model<IService>("Service", ServiceSchema);

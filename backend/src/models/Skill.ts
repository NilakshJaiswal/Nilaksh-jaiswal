import { Schema, model, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: string;
  icon?: string;
  level?: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, default: "", trim: true, maxlength: 60 },
    level: { type: String, default: "", trim: true, maxlength: 40 },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ visible: 1, category: 1, order: 1 });

export const Skill = model<ISkill>("Skill", SkillSchema);

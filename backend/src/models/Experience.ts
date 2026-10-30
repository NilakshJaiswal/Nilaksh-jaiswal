import { Schema, model, Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
  achievements: string[];
  technologies: string[];
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: { type: String, default: "", trim: true, maxlength: 40 },
    location: { type: String, default: "", trim: true, maxlength: 120 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    achievements: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ visible: 1, order: 1 });

export const Experience = model<IExperience>("Experience", ExperienceSchema);

import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  images: string[];
  featured: boolean;
  order: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    category: { type: String, default: "", trim: true, maxlength: 80 },
    shortDescription: { type: String, default: "", trim: true, maxlength: 280 },
    fullDescription: { type: String, default: "", trim: true, maxlength: 5000 },
    technologies: { type: [String], default: [] },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^https?:\/\//.test(v),
        message: "githubUrl must be a valid http(s) URL",
      },
    },
    liveUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^https?:\/\//.test(v),
        message: "liveUrl must be a valid http(s) URL",
      },
    },
    thumbnail: { type: String, default: "" },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

ProjectSchema.index({ status: 1, order: 1 });

export const Project = model<IProject>("Project", ProjectSchema);

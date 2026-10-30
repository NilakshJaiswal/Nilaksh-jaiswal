import { Schema, model, Document } from "mongoose";

export interface IAboutContent {
  heading: string;
  introduction: string;
  biography: string;
  professionalTitle: string;
  education: string;
  profileImage: string;
  supportingImages: string[];
  resumeUrl: string;
  ctaLabel: string;
  ctaLink: string;
  visible: boolean;
}

export interface IAbout extends Document {
  singletonKey: "singleton";
  draft: IAboutContent;
  published?: IAboutContent;
  createdAt: Date;
  updatedAt: Date;
}

const AboutContentSchema = new Schema<IAboutContent>(
  {
    heading: { type: String, default: "About Me", trim: true, maxlength: 120 },
    introduction: { type: String, default: "", trim: true, maxlength: 1000 },
    biography: { type: String, default: "", trim: true, maxlength: 5000 },
    professionalTitle: { type: String, default: "", trim: true, maxlength: 120 },
    education: { type: String, default: "", trim: true, maxlength: 200 },
    profileImage: { type: String, default: "" },
    supportingImages: { type: [String], default: [] },
    resumeUrl: { type: String, default: "", trim: true },
    ctaLabel: { type: String, default: "Contact Me", trim: true, maxlength: 40 },
    ctaLink: { type: String, default: "#contact", trim: true },
    visible: { type: Boolean, default: true },
  },
  { _id: false }
);

const AboutSchema = new Schema<IAbout>(
  {
    singletonKey: { type: String, enum: ["singleton"], required: true, unique: true, default: "singleton" },
    draft: { type: AboutContentSchema, default: () => ({}) },
    published: { type: AboutContentSchema, default: undefined },
  },
  { timestamps: true }
);

export const About = model<IAbout>("About", AboutSchema);

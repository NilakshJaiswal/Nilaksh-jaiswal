import { Schema, model, Document } from "mongoose";

export interface IContactContent {
  heading: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  otherSocialLinks: { label: string; url: string }[];
  ctaLabel: string;
  contactFormEnabled: boolean;
}

export interface IContact extends Document {
  singletonKey: "singleton";
  draft: IContactContent;
  published?: IContactContent;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema(
  {
    label: { type: String, trim: true, maxlength: 40 },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const ContactContentSchema = new Schema<IContactContent>(
  {
    heading: { type: String, default: "Let's Build Something", trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 500 },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    location: { type: String, default: "", trim: true, maxlength: 120 },
    githubUrl: { type: String, default: "", trim: true },
    linkedinUrl: { type: String, default: "", trim: true },
    otherSocialLinks: { type: [SocialLinkSchema], default: [] },
    ctaLabel: { type: String, default: "Contact Me", trim: true, maxlength: 40 },
    contactFormEnabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContact>(
  {
    singletonKey: { type: String, enum: ["singleton"], required: true, unique: true, default: "singleton" },
    draft: { type: ContactContentSchema, default: () => ({}) },
    published: { type: ContactContentSchema, default: undefined },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", ContactSchema);

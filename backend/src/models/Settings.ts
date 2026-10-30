import { Schema, model, Document } from "mongoose";

export interface IMarqueeItem {
  imageUrl: string;
  label: string;
  isOwnWork: boolean;
}

export interface ISettingsContent {
  siteName: string;
  pageTitle: string;
  metaDescription: string;
  favicon: string;
  logoText: string;
  navLabels: { about: string; skills: string; projects: string; experience: string; contact: string };
  footerText: string;
  copyrightText: string;
  heroHeading: string;
  heroRoleLabel: string;
  heroTypewriterText: string;
  heroActions: { label: string; link: string }[];
  backgroundVideoUrl: string;
  marqueeItems: IMarqueeItem[];
  sectionVisibility: {
    hero: boolean;
    marquee: boolean;
    about: boolean;
    skills: boolean;
    services: boolean;
    projects: boolean;
    experience: boolean;
    contact: boolean;
  };
}

export interface ISettings extends Document {
  singletonKey: "singleton";
  draft: ISettingsContent;
  published?: ISettingsContent;
  createdAt: Date;
  updatedAt: Date;
}

const HeroActionSchema = new Schema(
  { label: { type: String, trim: true, maxlength: 40 }, link: { type: String, trim: true } },
  { _id: false }
);

const MarqueeItemSchema = new Schema<IMarqueeItem>(
  {
    imageUrl: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "", maxlength: 80 },
    isOwnWork: { type: Boolean, default: false },
  },
  { _id: false }
);

const SettingsContentSchema = new Schema<ISettingsContent>(
  {
    siteName: { type: String, default: "Nilaksh Jaiswal", trim: true, maxlength: 80 },
    pageTitle: { type: String, default: "Nilaksh Jaiswal — Full-Stack Developer", trim: true, maxlength: 120 },
    metaDescription: { type: String, default: "", trim: true, maxlength: 300 },
    favicon: { type: String, default: "" },
    logoText: { type: String, default: "Nilaksh.", trim: true, maxlength: 40 },
    navLabels: {
      type: {
        about: { type: String, default: "About" },
        skills: { type: String, default: "Skills" },
        projects: { type: String, default: "Projects" },
        experience: { type: String, default: "Experience" },
        contact: { type: String, default: "Contact" },
      },
      default: {},
      _id: false,
    },
    footerText: { type: String, default: "", trim: true, maxlength: 200 },
    copyrightText: { type: String, default: "", trim: true, maxlength: 120 },
    heroHeading: { type: String, default: "HI, I'M NILAKSH", trim: true, maxlength: 80 },
    heroRoleLabel: { type: String, default: "DEVELOPER", trim: true, maxlength: 40 },
    heroTypewriterText: {
      type: String,
      default: "I bring your imagination to life on screen",
      trim: true,
      maxlength: 200,
    },
    heroActions: { type: [HeroActionSchema], default: [] },
    backgroundVideoUrl: { type: String, default: "", trim: true },
    marqueeItems: { type: [MarqueeItemSchema], default: [] },
    sectionVisibility: {
      type: {
        hero: { type: Boolean, default: true },
        marquee: { type: Boolean, default: true },
        about: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        services: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        contact: { type: Boolean, default: true },
      },
      default: {},
      _id: false,
    },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    singletonKey: { type: String, enum: ["singleton"], required: true, unique: true, default: "singleton" },
    draft: { type: SettingsContentSchema, default: () => ({}) },
    published: { type: SettingsContentSchema, default: undefined },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>("Settings", SettingsSchema);

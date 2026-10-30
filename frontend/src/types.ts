export type Project = {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  thumbnail?: string;
  images: string[];
  featured: boolean;
  order: number;
  status: "draft" | "published";
};

export type Skill = {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  level?: string;
  order: number;
  visible: boolean;
};

export type Service = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  ctaLabel?: string;
  ctaLink?: string;
  order: number;
  visible: boolean;
};

export type Experience = {
  _id: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
  achievements: string[];
  technologies: string[];
  order: number;
  visible: boolean;
};

export type AboutContent = {
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
};

export type ContactContent = {
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
};

export type MarqueeItem = {
  imageUrl: string;
  label: string;
  isOwnWork: boolean;
};

export type SettingsContent = {
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
  marqueeItems: MarqueeItem[];
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
};

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  [key: string]: any; // Allow additional properties for Sanity image handling
}

export interface HomePage {
  _id: string;
  _type: "homePage";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  image?: SanityImage;
  bio: string;
  sections: Section[];
}

export interface Section {
  _key?: string;
  title: string;
  text: string;
  image?: SanityImage;
  orientation: "imageLeft" | "imageRight";
  linkUrl?: string;
  openInNewTab?: boolean;
}

export interface Publication {
  _id: string;
  _type: "publication";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  publicationDate: string;
  description: string;
  googleScholarLink: string;
  linkButtonText?: string;
  image?: SanityImage;
}

export interface Tool {
  _id: string;
  _type: "tool";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  description: string;
  githubLink: string;
  linkButtonText?: string;
  image?: SanityImage;
}

export interface EmailItem {
  label: string;
  value: string;
  _key?: string;
}

export interface ContactInfo {
  _id: string;
  _type: "contactInfo";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  emails?: EmailItem[];
  email?: string; // Legacy field for backward compatibility
  phone?: string;
  linkedin?: string;
  X?: string;
  github?: string;
  googleScholar?: string;
}

export interface Project {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: { current: string };
  status: "active" | "completed" | "planning" | "on_hold";
  startDate?: string;
  endDate?: string;
  summary: string;
  description?: any[];
  image?: SanityImage;
  funding?: {
    source?: string;
    amount?: string;
    grantNumber?: string;
  };
  collaborators?: Array<{
    name: string;
    role?: string;
    institution?: string;
    url?: string;
    _key?: string;
  }>;
  publications?: Publication[];
  links?: Array<{
    title: string;
    url: string;
    _key?: string;
  }>;
  keywords?: string[];
  featured?: boolean;
  order?: number;
}

export interface Conference {
  _id: string;
  _type: "conference";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: { current: string };
  type: "keynote" | "invited" | "conference" | "workshop" | "poster" | "panel" | "seminar";
  conference: string;
  location?: string;
  date: string;
  abstract?: string;
  description?: any[];
  image?: SanityImage;
  slides?: {
    embedUrl?: string;
    downloadUrl?: string;
  };
  video?: {
    embedUrl?: string;
    platform?: "youtube" | "vimeo" | "other";
  };
  links?: Array<{
    title: string;
    url: string;
    _key?: string;
  }>;
  coAuthors?: string[];
  relatedPublication?: Publication;
  keywords?: string[];
  featured?: boolean;
  order?: number;
}
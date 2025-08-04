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
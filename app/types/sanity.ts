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
  status?: "published" | "in_press" | "accepted" | "under_review" | "preprint" | "submitted" | "other";
  customStatus?: string;
  publicationDate?: string;
  year?: number;
  journal?: string;
  authors?: string;
  description?: string;
  doi?: string;
  googleScholarLink?: string;
  preprintLink?: string;
  pdfLink?: string;
  linkButtonText?: string;
  image?: SanityImage;
  featured?: boolean;
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

export interface CV {
  _id: string;
  _type: "cv";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  version: string;
  lastUpdated: string;
  description?: string;
  file: {
    _type: "file";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  fileSize?: string;
  pages?: number;
  isPublic: boolean;
  isPrimary: boolean;
  order?: number;
}

export interface News {
  _id: string;
  _type: "news";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: { current: string };
  category: "research" | "software" | "publication" | "award" | "conference" | "general" | "lab";
  date: string;
  summary: string;
  content?: any[];
  image?: SanityImage;
  relatedProject?: Project;
  relatedPublication?: Publication;
  relatedTool?: Tool;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
}

export interface ResearchInterest {
  _id: string;
  _type: "researchInterest";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  keyword: string;
  category: "primary" | "methodology" | "application" | "technology" | "theory" | "interdisciplinary";
  description?: string;
  weight: number;
  color?: "blue" | "green" | "purple" | "amber" | "red" | "teal" | "pink" | "indigo";
  relatedProjects?: Project[];
  relatedPublications?: Publication[];
  active: boolean;
  order?: number;
}

export interface Dataset {
  _id: string;
  _type: "dataset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: { current: string };
  doi?: string;
  version?: string;
  releaseDate: string;
  description: string;
  longDescription?: any[];
  dataType: "tabular" | "images" | "text" | "audio" | "video" | "timeseries" | "geospatial" | "mixed" | "code" | "other";
  size?: {
    fileSize?: string;
    samples?: string;
  };
  license: string;
  accessType: "open" | "registration" | "request" | "restricted";
  downloadUrl?: string;
  repositoryUrl?: string;
  paperUrl?: string;
  citationText?: string;
  relatedProject?: Project;
  relatedPublication?: Publication;
  tags?: string[];
  image?: SanityImage;
  featured?: boolean;
  order?: number;
}
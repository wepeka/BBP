export type ProjectStatus = "selesai" | "berjalan";

export interface Project {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  client: string | null;
  clientNote: string | null;
  city: string;
  province: string;
  year: string;
  status: ProjectStatus;
  categories: string[];
  lat: number;
  lng: number;
  scope: string;
  descriptionId: string;
  images: string[];
  featured: boolean;
  order: number;
}

export interface Client {
  id: string;
  name: string;
  note?: string | null;
  city: string;
  province: string;
  since?: number;
  projectCount?: number;
  flagship: boolean;
}

export interface Service {
  id: string;
  order: number;
  nameId: string;
  nameEn: string;
  shortId: string;
  shortEn: string;
  descriptionId: string;
  icon: string;
}

export interface Equipment {
  id: string;
  category: string;
  name: string;
  spec: string;
  qty: number | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  order: number;
}

export type CertificateStatus = "berlaku" | "perlu_verifikasi" | "kedaluwarsa";

export interface Certificate {
  id: string;
  group: "legalitas" | "sbu" | "sistem_manajemen" | "keanggotaan";
  name: string;
  number: string | null;
  issuer: string;
  qualification?: string;
  status: CertificateStatus;
  note: string | null;
  fileUrl: string | null;
  expiresAt?: string | null;
}

export interface Settings {
  companyName: string;
  shortName: string;
  tagline: string;
  taglineLong: string;
  heroHeadlineId: string;
  heroSubheadId: string;
  heroHeadlineEn: string;
  heroSubheadEn: string;
  established: string;
  akta: string;
  address: string;
  city: string;
  province: string;
  postalArea: string;
  phone: string;
  fax: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  mapEmbedQuery: string;
  officeLat: number;
  officeLng: number;
  legal: {
    nib: string;
    npwp: string;
    siup: string;
    tdp: string;
  };
  director: {
    name: string;
    role: string;
    bioId: string;
    bioEn: string;
  };
  stats: {
    yearsActive: number;
    cities: number;
    projects: number;
    clients: number;
  };
  gapensiMember: boolean;
  iso9001: { standard: string; issuer: string; scopeId: string };
  smk3: {
    regulation: string;
    score: number;
    criteriaMet: number;
    criteriaTotal: number;
    category: string;
    level: string;
  };
}

export type RfqStatus = "baru" | "dihubungi" | "penawaran" | "menang" | "kalah";

export interface RfqEntry {
  id: string;
  createdAt: string;
  name: string;
  company: string | null;
  email: string;
  whatsapp: string;
  serviceId: string | null;
  location: string;
  areaEstimate: string | null;
  targetStart: string | null;
  message: string | null;
  status: RfqStatus;
  internalNote: string | null;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}

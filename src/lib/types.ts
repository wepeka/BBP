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
  /** Hidden projects stay in the admin but never appear on the public site. */
  hidden?: boolean;
  /** Optional facts shown in the project's data sheet. */
  area?: string | null;
  duration?: string | null;
  /** Extra data-sheet rows, e.g. { label: "Tonase baja", value: "320 ton" }. */
  facts?: { label: string; value: string }[];
  /** YouTube/Vimeo link shown under the gallery. */
  videoUrl?: string | null;
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
  logo?: string | null;
  website?: string | null;
  hidden?: boolean;
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
  image?: string | null;
  /** Short scope items listed under the description on the Layanan page. */
  points?: string[];
  /** Project category linked from this service ("Lihat proyek terkait"). */
  category?: string | null;
}

export interface Equipment {
  id: string;
  category: string;
  name: string;
  spec: string;
  qty: number | null;
  image?: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  order: number;
  photo?: string | null;
}

export type CertificateStatus = "berlaku" | "perlu_verifikasi" | "kedaluwarsa";
export type CertificateGroup = "legalitas" | "sbu" | "sistem_manajemen" | "keanggotaan";

export interface Certificate {
  id: string;
  group: CertificateGroup;
  name: string;
  number: string | null;
  issuer: string;
  qualification?: string;
  status: CertificateStatus;
  note: string | null;
  fileUrl: string | null;
  expiresAt?: string | null;
  hidden?: boolean;
}

export interface Category {
  id: string;
  label: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
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
  social: SocialLinks;
  /** Pre-filled text when a visitor taps a WhatsApp button. */
  whatsappMessage: string;
  /** Where new RFQ / download notifications are emailed (comma-separated). */
  notifyEmail: string;
  /** Company profile PDF offered for download (after leaving contact details). */
  companyProfilePdf: string | null;
  /** Google Analytics 4 measurement ID (G-…). */
  analyticsId: string;
  /** Google Search Console HTML-tag verification code. */
  googleVerification: string;
  /** Optional pages switched off by the admin (e.g. "k3", "karier"). */
  hiddenPages: string[];
}

export type RfqStatus = "baru" | "dihubungi" | "penawaran" | "menang" | "kalah";

export type RfqType = "penawaran" | "unduhan";

export interface RfqEntry {
  id: string;
  createdAt: string;
  /** "unduhan" = left details to download the company profile. */
  type?: RfqType;
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

export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminUser {
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: AdminRole;
}

/** One picture in a media slot. `projectId` links a hero slide to a project. */
export interface MediaItem {
  src: string;
  alt?: string;
  projectId?: string | null;
}

export type MediaMap = Record<string, MediaItem[]>;

/** Per-page section order and visibility chosen in the admin. */
export interface PageLayout {
  order?: string[];
  hidden?: string[];
}

export type LayoutMap = Record<string, PageLayout>;

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string | null;
  hidden?: boolean;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  requirements: string[];
  deadline?: string | null;
  hidden?: boolean;
}

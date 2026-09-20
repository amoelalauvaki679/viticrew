export type Role = "seafarer" | "agent";

export type Account = {
  userId: string;
  role: Role;
  displayName: string;
};

export type CrewProfile = {
  id: number;
  userId: string | null;
  slug: string;
  fullName: string;
  position: string;
  department: string;
  homeIsland: string;
  basedIn: string;
  availability: string;
  yearsExperience: number;
  bio: string;
  languages: string;
  skills: string;
  certifications: string;
  lookingFor: string;
  shareEnabled: boolean;
  photoHue: number;
  hasPhoto: boolean;
  viewCount: number;
  photoStamp: string;
};

export type CrewCard = CrewProfile & {
  docCount: number;
};

export type ProfileView = {
  id: number;
  createdAt: string;
  viewerLabel: string;
};

export type DocumentMeta = {
  id: number;
  profileId: number;
  docType: string;
  title: string;
  fileName: string;
  mimeType: string;
  expiresOn: string | null;
  createdAt: string;
};

export type Job = {
  id: number;
  userId: string | null;
  title: string;
  department: string;
  position: string;
  yachtName: string;
  yachtType: string;
  yachtLength: string;
  region: string;
  itinerary: string;
  startDate: string;
  contractType: string;
  salary: string;
  description: string;
  requirements: string;
  postedAt: string;
};

export type Application = {
  id: number;
  jobId: number;
  coverNote: string;
  createdAt: string;
  jobTitle: string;
  yachtName: string;
  region: string;
};

export type Agency = {
  id: number;
  userId: string | null;
  name: string;
  city: string;
  country: string;
  region: string;
  focus: string;
  email: string;
  website: string;
  about: string;
};

export type ProfileInput = {
  fullName: string;
  position: string;
  department: string;
  homeIsland: string;
  basedIn: string;
  availability: string;
  yearsExperience: number;
  bio: string;
  languages: string;
  skills: string;
  certifications: string;
  lookingFor: string;
  shareEnabled: boolean;
};

export type Article = {
  id: number;
  userId: string | null;
  slug: string;
  title: string;
  dek: string;
  body: string;
  region: string;
  category: string;
  department: string;
  publishedAt: string;
};

export type JobInput = {
  title: string;
  department: string;
  position: string;
  yachtName: string;
  yachtType: string;
  yachtLength: string;
  region: string;
  itinerary: string;
  startDate: string;
  contractType: string;
  salary: string;
  description: string;
  requirements: string;
};

export type ArticleInput = {
  title: string;
  dek: string;
  body: string;
  region: string;
  category: string;
  department: string;
};

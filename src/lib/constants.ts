export const APP_NAME = "VitiCrew";
export const APP_TAGLINE = "Fijian seafarers for yachts crossing the Pacific and Asia.";

export const DEPARTMENTS = [
  "Deck",
  "Interior",
  "Galley",
  "Engineering",
  "Specialist",
] as const;

export const POSITIONS: Record<(typeof DEPARTMENTS)[number], string[]> = {
  Deck: ["Deckhand", "Bosun", "Officer of the Watch", "Captain"],
  Interior: ["Stewardess", "Steward", "Chief Stewardess", "Purser"],
  Galley: ["Sous Chef", "Head Chef"],
  Engineering: ["Engineer", "Chief Engineer", "ETO"],
  Specialist: ["Dive Instructor", "Watersports", "Deck/Stew"],
};

export const ALL_POSITIONS = Object.values(POSITIONS).flat();

export const HOME_ISLANDS = [
  "Suva, Viti Levu",
  "Nadi, Viti Levu",
  "Lautoka, Viti Levu",
  "Savusavu, Vanua Levu",
  "Labasa, Vanua Levu",
  "Taveuni",
  "Kadavu",
  "Yasawa",
  "Mamanuca",
  "Ovalau",
  "Lau Group",
  "Rotuma",
] as const;

export const AVAILABILITY = [
  "Immediate",
  "Two weeks",
  "One month",
  "Seasonal",
  "Rotational",
  "Not available",
] as const;

export const YACHT_TYPES = [
  "Motor yacht",
  "Sailing yacht",
  "Expedition",
  "Catamaran",
  "Chase / support",
] as const;

export const CONTRACT_TYPES = [
  "Permanent",
  "Seasonal",
  "Rotational 2:2",
  "Rotational 3:3",
  "Daywork",
  "Delivery",
] as const;

export const REGIONS = [
  "Fiji / Islands",
  "South Pacific",
  "Coral Sea / Australia",
  "New Zealand",
  "Indonesia",
  "Southeast Asia",
  "Transpacific",
  "Circumnavigation",
] as const;

export const DOC_TYPES = [
  { id: "passport", label: "Passport" },
  { id: "seamans_book", label: "Seaman's book / CDC" },
  { id: "stcw", label: "STCW Basic Safety" },
  { id: "eng1", label: "ENG1 / Medical" },
  { id: "yellow_fever", label: "Yellow fever" },
  { id: "food_hygiene", label: "Food hygiene" },
  { id: "pdsd", label: "PDSD" },
  { id: "gmdss", label: "GMDSS" },
  { id: "powerboat", label: "Powerboat / RYA" },
  { id: "aec", label: "AEC / Engineering" },
  { id: "yachtmaster", label: "Yachtmaster" },
  { id: "dive", label: "Dive instructor" },
  { id: "cv", label: "CV" },
  { id: "reference", label: "Reference letter" },
  { id: "visa", label: "Visa" },
  { id: "other", label: "Other" },
] as const;

export function docLabel(id: string) {
  return DOC_TYPES.find((d) => d.id === id)?.label ?? id;
}

export const PACIFIC_PORTS = [
  { name: "Denarau", region: "Fiji" },
  { name: "Savusavu", region: "Fiji" },
  { name: "Port Vila", region: "Vanuatu" },
  { name: "Nouméa", region: "New Caledonia" },
  { name: "Nuku'alofa", region: "Tonga" },
  { name: "Apia", region: "Samoa" },
  { name: "Cairns", region: "Australia" },
  { name: "Auckland", region: "New Zealand" },
  { name: "Labuan Bajo", region: "Indonesia" },
  { name: "Phuket", region: "Thailand" },
  { name: "Langkawi", region: "Malaysia" },
  { name: "Singapore", region: "Singapore" },
  { name: "Hong Kong", region: "Hong Kong" },
  { name: "Manila", region: "Philippines" },
] as const;

export const NEWS_CATEGORIES = [
  "Season",
  "Manning",
  "Routing",
  "Shipyard",
  "Expedition",
  "Charter",
  "Compliance",
] as const;

export const MAX_PHOTO_BYTES = 1_000_000;
export const ALLOWED_PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"];

export const MAX_DOC_BYTES = 1_000_000;
export const ALLOWED_DOC_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

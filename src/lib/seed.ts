import type { Sql } from "@/lib/db";
import { hueFromName } from "@/lib/utils";

type SeedCrew = {
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
};

type SeedJob = {
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

type SeedAgency = {
  name: string;
  city: string;
  country: string;
  region: string;
  focus: string;
  email: string;
  website: string;
  about: string;
};

const CREW: SeedCrew[] = [
  {
    slug: "mere-naivalu",
    fullName: "Mere Naivalu",
    position: "Chief Stewardess",
    department: "Interior",
    homeIsland: "Suva, Viti Levu",
    basedIn: "Denarau, Fiji",
    availability: "Immediate",
    yearsExperience: 7,
    bio: "Suva-born chief stew with interior programmes on 40–90m motor yachts. Calm in guest turnover, precise with inventories, and used to dual-season programmes that winter in Southeast Asia and summer in Fiji waters.",
    languages: "English, Fijian, basic French",
    skills: "Service, floral, laundry, provisioning, guest relations, silver service",
    certifications: "STCW, ENG1, Food Hygiene L2, PDSD, Seaman's book (Fiji MSA)",
    lookingFor: "Chief stew or 2nd stew on a Pacific–Asia programme",
  },
  {
    slug: "jone-tawake",
    fullName: "Jone Tawake",
    position: "Deckhand",
    department: "Deck",
    homeIsland: "Lautoka, Viti Levu",
    basedIn: "Lautoka, Fiji",
    availability: "Two weeks",
    yearsExperience: 3,
    bio: "Grew up racing in Vuda and working the Mamanuca day-charter fleet. Strong swimmer, tidy on teak, and already used to captains who expect a deckhand to think two jobs ahead.",
    languages: "English, Fijian",
    skills: "Washdowns, tender driving, watersports, line handling, dive support",
    certifications: "STCW, ENG1, RYA Powerboat L2, PADI Rescue, Seaman's book",
    lookingFor: "Deckhand or deck/stew on sailing or motor, South Pacific season",
  },
  {
    slug: "sereana-ratu",
    fullName: "Sereana Ratu",
    position: "Head Chef",
    department: "Galley",
    homeIsland: "Nadi, Viti Levu",
    basedIn: "Nadi, Fiji",
    availability: "Seasonal",
    yearsExperience: 9,
    bio: "Hotel and yacht galley chef. Cooks Fijian, Indian-Fijian, and modern European menus from island markets. Used to provisioning in Denarau, Port Vila, and Phuket with limited cold rooms.",
    languages: "English, Fijian, Hindi",
    skills: "Guest menus, crew food, allergies, provisioning, budget control",
    certifications: "STCW, ENG1, Food Hygiene L3, Allergen awareness, Seaman's book",
    lookingFor: "Sole or head chef, 30–55m, Pacific season or dual Asia programme",
  },
  {
    slug: "tevita-koroi",
    fullName: "Tevita Koroi",
    position: "Chief Engineer",
    department: "Engineering",
    homeIsland: "Savusavu, Vanua Levu",
    basedIn: "Savusavu, Fiji",
    availability: "Immediate",
    yearsExperience: 12,
    bio: "Savusavu engineer who has kept long-range motor yachts running through the Coral Sea and into Indonesia. Comfortable as sole engineer on 40m or 2nd on larger expedition boats.",
    languages: "English, Fijian",
    skills: "CAT / MTU, watermakers, HVAC, bunkering, planned maintenance",
    certifications: "STCW, ENG1, AEC, Y4, GMDSS GOC, Seaman's book",
    lookingFor: "Chief or sole engineer, expedition or passage work",
  },
  {
    slug: "litia-cama",
    fullName: "Litia Cama",
    position: "Deck/Stew",
    department: "Specialist",
    homeIsland: "Taveuni",
    basedIn: "Taveuni",
    availability: "One month",
    yearsExperience: 4,
    bio: "Taveuni deck/stew who splits time between interior and watersports. Easy with families, good on a 7m tender, and used to small-crew sailing boats that need everyone to cover everything.",
    languages: "English, Fijian",
    skills: "Interior service, cabins, tender, snorkel guiding, kids clubs",
    certifications: "STCW, ENG1, Food Hygiene, Powerboat L2, Seaman's book",
    lookingFor: "Deck/stew on sailing yacht, South Pacific or SE Asia",
  },
  {
    slug: "apenisa-qoro",
    fullName: "Apenisa Qoro",
    position: "Bosun",
    department: "Deck",
    homeIsland: "Yasawa",
    basedIn: "Denarau, Fiji",
    availability: "Immediate",
    yearsExperience: 8,
    bio: "Yasawa bosun with a reputation for quiet decks and well-run tenders. Has led deck teams on Fiji charter seasons and wintered boats in Langkawi. Teaches junior Fijian deckhands properly.",
    languages: "English, Fijian",
    skills: "Deck leadership, painting, tenders, ISM, passage prep, guest watersports",
    certifications: "STCW, ENG1, PDSD, Powerboat L2, RYA PWC, Seaman's book",
    lookingFor: "Bosun, 40–70m motor, Pacific summer / Asia winter",
  },
  {
    slug: "adi-vani-tuiketei",
    fullName: "Adi Vani Tuiketei",
    position: "Purser",
    department: "Interior",
    homeIsland: "Suva, Viti Levu",
    basedIn: "Suva, Fiji",
    availability: "Rotational",
    yearsExperience: 11,
    bio: "Former hotel finance lead now running yacht admin: visas, cash, agent liaison, and crew travel across Fiji, Australia, and Singapore. Preferred by captains who want the paperwork off the bridge.",
    languages: "English, Fijian",
    skills: "Accounts, immigration, agent desk, crew travel, inventory, ISM admin",
    certifications: "STCW, ENG1, PDSD, Seaman's book",
    lookingFor: "Purser or chief stew/purser combo, rotational 3:3",
  },
  {
    slug: "samuela-vunibobo",
    fullName: "Samuela Vunibobo",
    position: "Captain",
    department: "Deck",
    homeIsland: "Kadavu",
    basedIn: "Kadavu",
    availability: "Seasonal",
    yearsExperience: 18,
    bio: "Kadavu captain with Fiji MSA tickets and long South Pacific mileage. Day charter, private 25–40m, and delivery work from Auckland to the Yasawas. Local waters knowledge that no plotter replaces.",
    languages: "English, Fijian",
    skills: "Fiji waters, reef navigation, guest programmes, ISM, crew training",
    certifications: "Master <500 GT, STCW, GMDSS, ENG1, Seaman's book, Yachtmaster Ocean",
    lookingFor: "Captain, 24–40m private or charter, Fiji and South Pacific",
  },
  {
    slug: "alisi-moce",
    fullName: "Alisi Moce",
    position: "Stewardess",
    department: "Interior",
    homeIsland: "Labasa, Vanua Levu",
    basedIn: "Labasa, Vanua Levu",
    availability: "Immediate",
    yearsExperience: 2,
    bio: "First-season stew from Labasa with hotel service behind her and a completed STCW pack. Bright, punctual, and looking for a boat that will train rather than just fill a bunk.",
    languages: "English, Fijian, Hindi",
    skills: "Cabins, laundry, service, crew mess, flower care",
    certifications: "STCW, ENG1, Food Hygiene L2, Seaman's book",
    lookingFor: "Junior stew, training yacht, Fiji or SE Asia",
  },
  {
    slug: "iosefo-bale",
    fullName: "Iosefo Bale",
    position: "Dive Instructor",
    department: "Specialist",
    homeIsland: "Mamanuca",
    basedIn: "Mamanuca",
    availability: "Immediate",
    yearsExperience: 6,
    bio: "PADI instructor raised in the Mamanucas. Runs guest dive days, compressor checks, and tender ops. Used to mixed charter groups and to keeping the dive locker audit-ready.",
    languages: "English, Fijian",
    skills: "PADI instruction, compressor, nitrox, guest briefings, tender",
    certifications: "STCW, ENG1, PADI IDC, EFR, Powerboat L2, Seaman's book",
    lookingFor: "Dive instructor or deck/dive on expedition or charter",
  },
  {
    slug: "epeli-naisoro",
    fullName: "Epeli Naisoro",
    position: "Officer of the Watch",
    department: "Deck",
    homeIsland: "Lautoka, Viti Levu",
    basedIn: "Lautoka, Fiji",
    availability: "Two weeks",
    yearsExperience: 10,
    bio: "OOW with Pacific and Coral Sea passages. Bridge watch, passage planning, and a deck team that actually paints. Wants a programme that still comes through Fiji each season.",
    languages: "English, Fijian",
    skills: "Watchkeeping, ECDIS, passage planning, deck, ISM",
    certifications: "OOW <3000, STCW, GMDSS GOC, ENG1, Seaman's book",
    lookingFor: "Mate / OOW, 45m+, dual-hemisphere programme",
  },
  {
    slug: "laisa-tiko",
    fullName: "Laisa Tiko",
    position: "Sous Chef",
    department: "Galley",
    homeIsland: "Suva, Viti Levu",
    basedIn: "Suva, Fiji",
    availability: "One month",
    yearsExperience: 5,
    bio: "Suva sous who has plated for 12-guest charters and still sent a proper crew meal. Clean, organised, and used to a head chef who is also the provisioner.",
    languages: "English, Fijian",
    skills: "Pastry, crew food, mise en place, provisioning, dietary",
    certifications: "STCW, ENG1, Food Hygiene L2, Seaman's book",
    lookingFor: "Sous or sole chef on 30–45m",
  },
];

const JOBS: SeedJob[] = [
  {
    title: "Deckhand — Fiji to New Caledonia season",
    department: "Deck",
    position: "Deckhand",
    yachtName: "MY Coral Trader",
    yachtType: "Motor yacht",
    yachtLength: "48m",
    region: "South Pacific",
    itinerary: "Denarau · Yasawas · Port Vila · Nouméa · return Fiji",
    startDate: "May 2027",
    contractType: "Seasonal",
    salary: "DOE + tips",
    description:
      "Private 48m looking for a Fijian deckhand who already knows these waters. Washdowns, tender, and guest snorkel days. Join in Denarau, leave the programme in Nouméa or stay for the run home.",
    requirements: "STCW, ENG1, Powerboat, Seaman's book, 2+ years deck",
  },
  {
    title: "Stewardess — Andaman winter programme",
    department: "Interior",
    position: "Stewardess",
    yachtName: "MY Eastern Monsoon",
    yachtType: "Motor yacht",
    yachtLength: "55m",
    region: "Southeast Asia",
    itinerary: "Phuket · Langkawi · Singapore · returning via Indonesia",
    startDate: "November 2026",
    contractType: "Rotational 2:2",
    salary: "€3,200 / month",
    description:
      "Interior slot on a dual-season motor yacht that summers in Fiji and winters in the Andaman. Preference for crew who can handle both island provisioning and Asian agent desks.",
    requirements: "STCW, ENG1, Food Hygiene, interior yacht experience",
  },
  {
    title: "Head Chef — transpacific sailing passage",
    department: "Galley",
    position: "Head Chef",
    yachtName: "SY Tradewind",
    yachtType: "Sailing yacht",
    yachtLength: "38m",
    region: "Transpacific",
    itinerary: "Denarau · Tonga · Bora Bora · Marquesas",
    startDate: "June 2027",
    contractType: "Delivery",
    salary: "DOE",
    description:
      "Sole chef for an owner passage east from Fiji. Eight on board, simple excellent food, serious provisioning in Denarau before departure. Sailing experience a plus, not required.",
    requirements: "STCW, ENG1, Food Hygiene L2, yacht or remote-galley time",
  },
  {
    title: "Engineer — Raja Ampat expedition",
    department: "Engineering",
    position: "Engineer",
    yachtName: "MY Tanoa",
    yachtType: "Expedition",
    yachtLength: "72m",
    region: "Indonesia",
    itinerary: "Sorong · Raja Ampat · Triton Bay · Darwin",
    startDate: "April 2027",
    contractType: "Seasonal",
    salary: "DOE",
    description:
      "Expedition yacht wants an engineer comfortable far from a shipyard. Watermakers, dive compressors, and long days between bunkering. Fijian engineers with Coral Sea time favoured.",
    requirements: "STCW, AEC or higher, ENG1, GMDSS preferred",
  },
  {
    title: "Bosun — East Australia to Fiji",
    department: "Deck",
    position: "Bosun",
    yachtName: "MY Reef Line",
    yachtType: "Motor yacht",
    yachtLength: "45m",
    region: "Coral Sea / Australia",
    itinerary: "Cairns · Great Barrier Reef · Vanuatu · Fiji",
    startDate: "July 2027",
    contractType: "Seasonal",
    salary: "AUD DOE",
    description:
      "Bosun to take the boat north from Cairns after the Australian winter and into Fiji for the owner's family season. Deck team of three.",
    requirements: "STCW, ENG1, bosun time on 40m+, Powerboat",
  },
  {
    title: "Deck/Stew — Tonga, Samoa, Fiji loop",
    department: "Specialist",
    position: "Deck/Stew",
    yachtName: "SY Vaka Moana",
    yachtType: "Sailing yacht",
    yachtLength: "32m",
    region: "South Pacific",
    itinerary: "Nuku'alofa · Apia · Savusavu · Suva",
    startDate: "May 2027",
    contractType: "Seasonal",
    salary: "USD 2,800 + tips",
    description:
      "Small-crew sailing yacht, four crew plus owners. Need someone who will do cabins in the morning and the tender after lunch. Local knowledge of the Lau and Tonga groups is gold.",
    requirements: "STCW, ENG1, deck/stew or stew + tender",
  },
  {
    title: "Captain — Denarau day charter",
    department: "Deck",
    position: "Captain",
    yachtName: "MY Bula Day",
    yachtType: "Motor yacht",
    yachtLength: "28m",
    region: "Fiji / Islands",
    itinerary: "Denarau · Mamanuca · Yasawa day trips",
    startDate: "Immediate",
    contractType: "Permanent",
    salary: "FJD competitive",
    description:
      "Local captain for a Denarau-based 28m running high-end day charter. Must hold Fiji tickets and know the Mamanuca reef cuts in trade-wind chop.",
    requirements: "Fiji MSA master, local waters, guest programme experience",
  },
  {
    title: "Chief Stewardess — dual hemisphere 90m",
    department: "Interior",
    position: "Chief Stewardess",
    yachtName: "MY Pacific House",
    yachtType: "Motor yacht",
    yachtLength: "90m",
    region: "Circumnavigation",
    itinerary: "Singapore winter · Fiji / French Polynesia summer",
    startDate: "October 2026",
    contractType: "Rotational 3:3",
    salary: "€5,500 / month",
    description:
      "Large motor yacht rotating chief stews. Interior team of eight. Looking for a chief who has hired and trained Pacific crew and can run an Asian shipyard period without drama.",
    requirements: "Chief stew on 60m+, STCW, ENG1, leadership references",
  },
];

const AGENCIES: SeedAgency[] = [
  {
    name: "Vaka Yacht Management",
    city: "Denarau",
    country: "Fiji",
    region: "Pacific",
    focus: "Local crew, day charter, owner programmes",
    email: "desk@vakayachts.fj",
    website: "https://vakayachts.example",
    about:
      "Denarau desk placing Fijian crew on visiting yachts and running shore support through the Yasawas and Vanua Levu.",
  },
  {
    name: "Coral Route Crew",
    city: "Cairns",
    country: "Australia",
    region: "Pacific",
    focus: "Coral Sea passages, GBR, Fiji arrivals",
    email: "hello@coralroute.example",
    website: "https://coralroute.example",
    about:
      "Cairns agency for boats hopping the Coral Sea. Regularly requests Fijian deck and engineering for the run north.",
  },
  {
    name: "Asia Helm Agency",
    city: "Singapore",
    country: "Singapore",
    region: "Asia",
    focus: "SE Asia rotations, shipyard periods",
    email: "crew@asiahelm.example",
    website: "https://asiahelm.example",
    about:
      "Singapore placement desk for dual-season yachts that winter in Asia and need Pacific crew who can clear into Changi and Phuket.",
  },
  {
    name: "Andaman Deck",
    city: "Phuket",
    country: "Thailand",
    region: "Asia",
    focus: "Andaman charter, interior and deck",
    email: "desk@andamandeck.example",
    website: "https://andamandeck.example",
    about:
      "Phuket crew office. Shortlists Fijian interior and deck for the November–April Andaman season.",
  },
  {
    name: "Langkawi Marine Staffing",
    city: "Langkawi",
    country: "Malaysia",
    region: "Asia",
    focus: "Refit crew, bosuns, engineers",
    email: "crew@langkawimarine.example",
    website: "https://langkawimarine.example",
    about:
      "Langkawi yard-season staffing. Wants bosuns and engineers who have already wintered a boat in Asia.",
  },
  {
    name: "Pacific Passage Partners",
    city: "Auckland",
    country: "New Zealand",
    region: "Pacific",
    focus: "Deliveries, cyclone season haul-out",
    email: "ops@pacificpassage.example",
    website: "https://pacificpassage.example",
    about:
      "Auckland delivery and standing-crew desk. Places Fijian captains and OOW on NZ–Fiji–Tonga loops.",
  },
  {
    name: "Harbour Desk",
    city: "Hong Kong",
    country: "Hong Kong",
    region: "Asia",
    focus: "Owner representation, senior crew",
    email: "desk@harbourdesk.example",
    website: "https://harbourdesk.example",
    about:
      "Hong Kong owner desk. Senior interior and officers for Asia-Pacific private yachts.",
  },
  {
    name: "Sydney Supercrew",
    city: "Sydney",
    country: "Australia",
    region: "Pacific",
    focus: "East coast season, interior, galley",
    email: "book@sydneysupercrew.example",
    website: "https://sydneysupercrew.example",
    about:
      "Sydney placement for the Australian summer, with a Fiji list for boats continuing north.",
  },
  {
    name: "Port Vila Crew Office",
    city: "Port Vila",
    country: "Vanuatu",
    region: "Pacific",
    focus: "Vanuatu season, daywork, relief",
    email: "office@portvilacrew.example",
    website: "https://portvilacrew.example",
    about:
      "Port Vila relief crew. Often pairs with Denarau boats that add Vanuatu to the itinerary.",
  },
  {
    name: "Raja Manning",
    city: "Labuan Bajo",
    country: "Indonesia",
    region: "Asia",
    focus: "Expedition, dive, engineering",
    email: "crew@rajamanning.example",
    website: "https://rajamanning.example",
    about:
      "Expedition and phinisi-adjacent desk in Labuan Bajo. Dive instructors and engineers with Pacific tickets.",
  },
  {
    name: "Noumea Charter Desk",
    city: "Nouméa",
    country: "New Caledonia",
    region: "Pacific",
    focus: "Charter, French-speaking interior",
    email: "desk@noumeacharter.example",
    website: "https://noumeacharter.example",
    about:
      "Nouméa charter office. Asks for Fijian crew with basic French for the lagoon season.",
  },
  {
    name: "Manila Yacht Manning",
    city: "Manila",
    country: "Philippines",
    region: "Asia",
    focus: "Manning, officers, interior",
    email: "manning@manilayacht.example",
    website: "https://manilayacht.example",
    about:
      "Manila manning agency adding a Fijian seafarer list for Asia-Pacific owner yachts.",
  },
];

export async function ensureSeed(sql: Sql) {
  const existing = await sql<{ n: number }>`select count(*)::int as n from crew_profiles`;
  if ((existing[0]?.n ?? 0) === 0) {
    await insertCatalog(sql);
  }
  try {
    await ensureNews(sql);
  } catch (err) {
    console.error("[seed] corridor briefing not ready", err);
  }
  try {
    await ensureProfileStats(sql);
  } catch (err) {
    console.error("[seed] profile stats not ready", err);
  }
}

async function ensureProfileStats(sql: Sql) {
  await sql`
    update crew_profiles
    set view_count = greatest(view_count, 11 + (years_experience * 6) + (char_length(slug) % 9))
    where user_id is null and view_count = 0
  `;
}


async function insertCatalog(sql: Sql) {
  for (const c of CREW) {
    const hue = hueFromName(c.fullName);
    await sql`
      insert into crew_profiles (
        user_id, slug, full_name, position, department, home_island, based_in,
        availability, years_experience, bio, languages, skills, certifications,
        looking_for, share_enabled, photo_hue
      ) values (
        null, ${c.slug}, ${c.fullName}, ${c.position}, ${c.department}, ${c.homeIsland},
        ${c.basedIn}, ${c.availability}, ${c.yearsExperience}, ${c.bio}, ${c.languages},
        ${c.skills}, ${c.certifications}, ${c.lookingFor}, true, ${hue}
      )
    `;
  }

  for (const j of JOBS) {
    await sql`
      insert into jobs (
        user_id, title, department, position, yacht_name, yacht_type, yacht_length,
        region, itinerary, start_date, contract_type, salary, description, requirements
      ) values (
        null, ${j.title}, ${j.department}, ${j.position}, ${j.yachtName}, ${j.yachtType},
        ${j.yachtLength}, ${j.region}, ${j.itinerary}, ${j.startDate}, ${j.contractType},
        ${j.salary}, ${j.description}, ${j.requirements}
      )
    `;
  }

  for (const a of AGENCIES) {
    await sql`
      insert into agencies (
        user_id, name, city, country, region, focus, email, website, about
      ) values (
        null, ${a.name}, ${a.city}, ${a.country}, ${a.region}, ${a.focus},
        ${a.email}, ${a.website}, ${a.about}
      )
    `;
  }
}

type SeedArticle = {
  slug: string;
  title: string;
  dek: string;
  body: string;
  region: string;
  category: string;
  department: string;
  publishedAt: string;
};

const ARTICLES: SeedArticle[] = [
  {
    slug: "fiji-season-denarau-crew-2027",
    title: "Fiji season is filling. Denarau desks want local deck and stew now.",
    dek: "May–October programmes are locking crew earlier. Captains who wait until April will take whoever is left on the dock.",
    region: "Fiji / Islands",
    category: "Season",
    department: "Deck",
    publishedAt: "2026-09-02T08:00:00Z",
    body: `Denarau is already taking holds for the 2027 Fiji season. Private 40–55m boats that wintered in Langkawi or Phuket are asking for Fijian deckhands, bosuns, and interior who can join on arrival rather than fly in from Europe.

The pattern is the same as last year, only tighter. A yacht clears in, wants a washdown crew that knows the Yasawa cuts, and does not want to train a first-timer on reef transits. Day-charter 24–32m boats in the Mamanucas are also short of local captains with Fiji MSA tickets.

VitiCrew cards with Immediate or Two weeks availability are the ones desks are forwarding this week. If you place Pacific crew, send the public card — STCW, seaman’s book, and ENG1 on file — instead of a PDF trail across three time zones.`,
  },
  {
    slug: "andaman-winter-crew-swap",
    title: "Andaman winter: the same Fijian crew, a Phuket contract.",
    dek: "Dual-hemisphere yachts are keeping Pacific interior through the Asia winter rather than turning the whole team over in Singapore.",
    region: "Southeast Asia",
    category: "Manning",
    department: "Interior",
    publishedAt: "2026-08-28T08:00:00Z",
    body: `A growing list of 50–90m motor yachts now run Fiji or French Polynesia in the southern winter and the Andaman in the northern one. The crew ask from Phuket and Langkawi desks is no longer “anyone with yacht time.” It is “someone who has already provisioned in Denarau and can work an Asian agent desk.”

Chief stews and rotational 2:2 interior are the first names requested. Food hygiene and PDSD still matter. What gets a card opened is a Fijian seafarer who lists both Pacific and SE Asia in looking-for, with tickets that will clear Thailand and Singapore.

Forward the VitiCrew link to the Phuket office before they start a Europe-only shortlist. The public card is readable without a login. Files open once the desk is signed in.`,
  },
  {
    slug: "cyclone-window-coral-sea-run",
    title: "Cyclone window: Coral Sea run south, Fijian engineers in demand.",
    dek: "Boats leaving Fiji for Cairns, Brisbane, or Auckland want engineers who have already done the Coral Sea, not a first ocean passage.",
    region: "Coral Sea / Australia",
    category: "Routing",
    department: "Engineering",
    publishedAt: "2026-08-21T08:00:00Z",
    body: `From November the smart programmes are already off the Fiji bank. The remaining work is deliveries: Denarau or Savusavu to Cairns, then a yard or a New Zealand haul-out. Coral Route Crew in Cairns and Pacific Passage Partners in Auckland are asking for sole engineers and bosuns who know bunkering between Port Vila and the Australian coast.

AEC or Y4, GMDSS, and a seaman’s book that is actually current — not last season’s scan — is the filter. Savusavu and Lautoka engineers on the board fit that list.

If you are an Australian or New Zealand desk taking a Fiji boat south, share the engineer’s VitiCrew card with the receiving yard. One link. Expiry dates visible. No WhatsApp archaeology.`,
  },
  {
    slug: "langkawi-yard-bosuns",
    title: "Langkawi yard season wants bosuns who have wintered a boat in Asia.",
    dek: "Refit months in Malaysia are a manning problem, not a paint problem. Desks are short of deck leadership that will stay through the yard.",
    region: "Southeast Asia",
    category: "Shipyard",
    department: "Deck",
    publishedAt: "2026-08-14T08:00:00Z",
    body: `Langkawi Marine Staffing’s list this winter is bosuns and painters who have already done an Asian yard. The complaint from captains is familiar: a European bosun who has never sat through a Malaysian refit leaves after six weeks.

Fijian bosuns who wintered boats after a Fiji season — and who list Langkawi or Singapore on the card — are being shortlisted. Powerboat, PDSD, and a calm deck team matter more than a 70m CV.

Share those cards with the Langkawi office now, not when the boat is on the hard. The briefing pack on each VitiCrew profile is written for exactly this forward: Denarau to Langkawi, one paste.`,
  },
  {
    slug: "raja-ampat-expedition-manning",
    title: "Raja Ampat programmes are hiring dive and engineering out of Fiji.",
    dek: "Expedition yachts staging in Labuan Bajo want compressor-competent crew and engineers used to being a long way from a shipyard.",
    region: "Indonesia",
    category: "Expedition",
    department: "Specialist",
    publishedAt: "2026-08-07T08:00:00Z",
    body: `Raja Manning in Labuan Bajo is filling April programmes. The boats are 40–75m expedition, sometimes with a dive centre that has to stay audit-ready. PADI instructors raised in the Mamanucas, and engineers out of Savusavu, are a better match than a Med dive instructor who has never run a compressor in 32-degree humidity.

Tickets: STCW, ENG1, dive instructor or AEC, seaman’s book. Guest briefings and tender time are assumed.

Indonesian desks can open the document vault once they have a VitiCrew agent login. Until then, the public card still shows which tickets are on file and when they expire.`,
  },
  {
    slug: "vanuatu-noumea-add-on",
    title: "Vanuatu and Nouméa add-ons: French-speaking interior and local deck.",
    dek: "Fiji boats stretching the itinerary west need crew who can work Port Vila and the New Caledonia lagoon without a full crew change.",
    region: "South Pacific",
    category: "Charter",
    department: "Interior",
    publishedAt: "2026-07-30T08:00:00Z",
    body: `A Fiji season that used to turn at the Yasawas now often adds Port Vila and Nouméa. Port Vila Crew Office wants relief deck and stew. Noumea Charter Desk still asks for basic French on interior — even a little changes guest service on a French-flagged charter.

Fijian crew who list French, or who have already done Vanuatu, should be at the top of those forwards. The rest of the ticket pack is the usual STCW and food hygiene.

Send the card, not a zip of scans. The Nouméa office can read it in the same format the Denarau office used.`,
  },
  {
    slug: "msa-book-asia-clearance",
    title: "Fiji MSA books and Asia clearance: what desks are actually checking.",
    dek: "Singapore and Phuket agents are no longer treating a seaman’s book as a nice-to-have. Expiry and scan quality are the first filter.",
    region: "Southeast Asia",
    category: "Compliance",
    department: "",
    publishedAt: "2026-07-22T08:00:00Z",
    body: `Two seasons ago a captain would take a Fijian deckhand on a passport and a promise. Asia-Pacific programmes that clear Singapore, Malaysia, and Thailand now want the MSA seaman’s book photographed, dated, and sitting next to ENG1 and STCW on the same card.

VitiCrew’s vault is built for that check. The public page shows the ticket is on file. A signed-in agent opens the file. Seafarers who have not uploaded the book yet are invisible to the desks that matter in November.

If you run a desk in Singapore or Hong Kong, bookmark the board, not a shared drive. When a boat asks “do we have local Pacific crew who can clear,” you forward three cards.`,
  },
  {
    slug: "dual-hemisphere-chief-stew",
    title: "90m dual-hemisphere boats are hiring Fijian chief stews on 3:3.",
    dek: "Singapore winter, Fiji or Polynesia summer. Interior leadership that can train Pacific juniors is the scarce skill, not another European chief.",
    region: "Circumnavigation",
    category: "Manning",
    department: "Interior",
    publishedAt: "2026-07-15T08:00:00Z",
    body: `Large motor yachts on a true dual-hemisphere programme need a chief stew who has hired and kept Fijian interior, not only run a Med team. Rotational 3:3 is the contract showing up. Pay is at the top of the interior scale because the shipyard period in Asia and the guest season in Fiji are both on the chief’s watch.

Pursers who can do visas, cash, and crew travel across Fiji, Australia, and Singapore are being asked for in the same breath.

The board already has those names. Share the chief stew cards with the Hong Kong or Singapore owner desk this week — the winter joiners are being chosen now, not in October.`,
  },
];

export async function ensureNews(sql: Sql) {
  const ready = await sql<{ n: number }>`
    select count(*)::int as n
    from information_schema.tables
    where table_schema = 'public' and table_name = 'articles'
  `;
  if ((ready[0]?.n ?? 0) === 0) return;

  const existing = await sql<{ n: number }>`select count(*)::int as n from articles`;
  if ((existing[0]?.n ?? 0) > 0) return;

  for (const a of ARTICLES) {
    await sql`
      insert into articles (
        user_id, slug, title, dek, body, region, category, department, published_at
      ) values (
        null, ${a.slug}, ${a.title}, ${a.dek}, ${a.body}, ${a.region}, ${a.category},
        ${a.department}, ${a.publishedAt}
      )
    `;
  }
}


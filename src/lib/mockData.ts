import type {
  Alert,
  Conflict,
  ConflictEvent,
  ConflictStat,
  Country,
  CountryDashboard,
  CountryProfile,
  CountryRelation,
  HistoricalEvent,
  HistoricalMilestone,
  NewsArticle,
  WarRoom,
} from "@/lib/types";

export const countries: Country[] = [
  { id: 1, name: "United States", isoCode: "USA", region: "North America", flagUrl: "🇺🇸" },
  { id: 2, name: "Iran", isoCode: "IRN", region: "Middle East", flagUrl: "🇮🇷" },
  { id: 3, name: "Israel", isoCode: "ISR", region: "Middle East", flagUrl: "🇮🇱" },
  { id: 4, name: "Pakistan", isoCode: "PAK", region: "South Asia", flagUrl: "🇵🇰" },
  { id: 5, name: "Russia", isoCode: "RUS", region: "Eastern Europe", flagUrl: "🇷🇺" },
  { id: 6, name: "Ukraine", isoCode: "UKR", region: "Eastern Europe", flagUrl: "🇺🇦" },
  { id: 7, name: "China", isoCode: "CHN", region: "East Asia", flagUrl: "🇨🇳" },
  { id: 8, name: "Taiwan", isoCode: "TWN", region: "East Asia", flagUrl: "🇹🇼" },
];

export const conflicts: Conflict[] = [
  {
    id: 1,
    name: "U.S.-Iran Escalation Watch",
    startDate: "2024-01-03",
    status: "ACTIVE",
    description:
      "Tracks military signaling, sanctions pressure, proxy incidents, and maritime risk between Washington and Tehran.",
    region: "Middle East",
    severity: "CRITICAL",
    participants: [
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "AGGRESSOR" },
      { countryId: 2, countryName: "Iran", isoCode: "IRN", role: "DEFENDER" },
      { countryId: 3, countryName: "Israel", isoCode: "ISR", role: "ALLY" },
    ],
    totalCasualties: 1240,
    territoryChangeSqKm: 0,
    economicLossUsd: 3200000000,
    linkedEventIds: ["cia-coup-iran-1953", "iran-revolution-1979", "iran-iraq-war-1988", "jcpoa-nuclear-deal-2015"],
  },
  {
    id: 2,
    name: "Russia-Ukraine War",
    startDate: "2022-02-24",
    status: "ACTIVE",
    description:
      "Large-scale interstate war shaping European security, sanctions regimes, and energy flows.",
    region: "Eastern Europe",
    severity: "CRITICAL",
    participants: [
      { countryId: 5, countryName: "Russia", isoCode: "RUS", role: "AGGRESSOR" },
      { countryId: 6, countryName: "Ukraine", isoCode: "UKR", role: "DEFENDER" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "ALLY" },
    ],
    totalCasualties: 285000,
    territoryChangeSqKm: 12850,
    economicLossUsd: 486000000000,
  },
  {
    id: 3,
    name: "Taiwan Strait Tensions",
    startDate: "2023-08-01",
    status: "FROZEN",
    description:
      "Persistent military signaling, economic coercion risk, and alliance posturing across the Taiwan Strait.",
    region: "East Asia",
    severity: "HIGH",
    participants: [
      { countryId: 7, countryName: "China", isoCode: "CHN", role: "AGGRESSOR" },
      { countryId: 8, countryName: "Taiwan", isoCode: "TWN", role: "DEFENDER" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "ALLY" },
    ],
    totalCasualties: 12,
    territoryChangeSqKm: 0,
    economicLossUsd: 900000000,
  },
];

export const conflictEvents: Record<number, ConflictEvent[]> = {
  1: [
    {
      id: 101,
      conflictId: 1,
      eventType: "Maritime Security",
      title: "U.S. naval patrol intensified in Gulf transit corridor",
      description:
        "Additional escort assets deployed after renewed shipping disruption warnings from regional proxy groups.",
      latitude: 26.5,
      longitude: 56.3,
      eventDate: "2026-04-25T10:00:00Z",
      source: "Reuters + regional maritime bulletin",
      confidenceLevel: "VERIFIED",
    },
    {
      id: 102,
      conflictId: 1,
      eventType: "Sanctions",
      title: "Treasury expands designations on procurement network",
      description:
        "New restrictions target procurement intermediaries tied to dual-use electronics and drone components.",
      latitude: 35.6892,
      longitude: 51.389,
      eventDate: "2026-04-24T13:30:00Z",
      source: "U.S. Treasury release",
      confidenceLevel: "VERIFIED",
    },
  ],
  2: [
    {
      id: 201,
      conflictId: 2,
      eventType: "Frontline",
      title: "Drone and artillery exchanges intensify near contested sector",
      description:
        "Cross-source reporting indicates sustained pressure on supply routes and local energy infrastructure.",
      latitude: 48.3794,
      longitude: 31.1656,
      eventDate: "2026-04-25T07:15:00Z",
      source: "ISW + Reuters",
      confidenceLevel: "VERIFIED",
    },
  ],
  3: [
    {
      id: 301,
      conflictId: 3,
      eventType: "Naval Activity",
      title: "Carrier transit and PLA air sorties raise deterrence signaling",
      description:
        "Exercises remain below immediate crisis threshold but sustain elevated regional alertness.",
      latitude: 23.6978,
      longitude: 120.9605,
      eventDate: "2026-04-23T05:45:00Z",
      source: "Defense ministry releases",
      confidenceLevel: "MEDIUM",
    },
  ],
};

export const conflictStats: Record<number, ConflictStat[]> = {
  1: [
    {
      id: 1001,
      conflictId: 1,
      countryId: 1,
      countryName: "United States",
      casualties: 140,
      territoryChangeSqKm: 0,
      economicLossUsd: 1200000000,
      confidenceLevel: "MEDIUM",
      recordedAt: "2026-04-25T00:00:00Z",
    },
    {
      id: 1002,
      conflictId: 1,
      countryId: 2,
      countryName: "Iran",
      casualties: 820,
      territoryChangeSqKm: 0,
      economicLossUsd: 1800000000,
      confidenceLevel: "MEDIUM",
      recordedAt: "2026-04-25T00:00:00Z",
    },
  ],
  2: [
    {
      id: 2001,
      conflictId: 2,
      countryId: 6,
      countryName: "Ukraine",
      casualties: 162000,
      territoryChangeSqKm: -12850,
      economicLossUsd: 286000000000,
      confidenceLevel: "HIGH",
      recordedAt: "2026-04-25T00:00:00Z",
    },
  ],
  3: [
    {
      id: 3001,
      conflictId: 3,
      countryId: 8,
      countryName: "Taiwan",
      casualties: 2,
      territoryChangeSqKm: 0,
      economicLossUsd: 420000000,
      confidenceLevel: "LOW",
      recordedAt: "2026-04-25T00:00:00Z",
    },
  ],
};

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Washington and Tehran trade warnings after Gulf security incident",
    content:
      "Officials on both sides used calibrated rhetoric, but shipping insurers lifted risk premiums for several corridors.",
    source: "Reuters",
    sourceUrl: "https://example.com/news/us-iran-gulf",
    imageUrl: "",
    publishedAt: "2026-04-25T12:00:00Z",
    confidenceLevel: "VERIFIED",
    category: "Conflict",
    relatedCountries: ["USA", "IRN", "ISR"],
    conflictId: 1,
  },
  {
    id: 2,
    title: "Aid pipeline and energy resilience dominate Kyiv support talks",
    content:
      "European partners focused on air defense replenishment, fiscal support, and grid hardening ahead of summer demand.",
    source: "Financial Times",
    sourceUrl: "https://example.com/news/ukraine-aid",
    imageUrl: "",
    publishedAt: "2026-04-25T09:15:00Z",
    confidenceLevel: "VERIFIED",
    category: "Diplomacy",
    relatedCountries: ["UKR", "USA", "RUS"],
    conflictId: 2,
  },
  {
    id: 3,
    title: "Regional militaries monitor elevated activity around Taiwan Strait",
    content:
      "Open-source tracking and official releases suggest heightened signaling rather than immediate pre-invasion preparation.",
    source: "Nikkei Asia",
    sourceUrl: "https://example.com/news/taiwan-strait",
    imageUrl: "",
    publishedAt: "2026-04-24T18:40:00Z",
    confidenceLevel: "DISPUTED",
    category: "Military",
    relatedCountries: ["CHN", "TWN", "USA"],
    conflictId: 3,
  },
  {
    id: 4,
    title: "Pakistan balances Gulf ties, border security, and inflation pressure",
    content:
      "Islamabad faces overlapping domestic and regional constraints while trying to preserve external financing options.",
    source: "Dawn",
    sourceUrl: "https://example.com/news/pakistan-balance",
    imageUrl: "",
    publishedAt: "2026-04-24T08:00:00Z",
    confidenceLevel: "VERIFIED",
    category: "Country Intelligence",
    relatedCountries: ["PAK", "IRN", "USA"],
  },
];

export const alerts: Alert[] = [
  {
    id: 1,
    title: "Critical maritime risk update",
    message: "Escort posture changed in the Gulf after renewed disruption warnings.",
    alertType: "BREAKING",
    severity: "CRITICAL",
    conflictId: 1,
    conflictName: "U.S.-Iran Escalation Watch",
    createdAt: "2026-04-25T12:10:00Z",
    read: false,
  },
  {
    id: 2,
    title: "New sanctions package published",
    message: "Analysts reviewing procurement network exposure and likely retaliation paths.",
    alertType: "UPDATE",
    severity: "HIGH",
    countryId: 2,
    countryName: "Iran",
    createdAt: "2026-04-24T14:00:00Z",
    read: false,
  },
];

const countryProfiles: Record<string, CountryProfile> = {
  USA: {
    countryId: 1,
    countryName: "United States",
    isoCode: "USA",
    politicalSystem: "Federal presidential republic",
    currentLeadership: "President-led executive with congressional oversight",
    summary:
      "The United States remains the central security guarantor for multiple alliance networks and is shaping sanctions, military aid, and maritime deterrence across multiple theaters.",
    warHistory:
      "The United States built its modern strategic role through the world wars, Korea, Vietnam, the Gulf War, Afghanistan, and Iraq.",
    conflictRecord:
      "Current exposure is driven more by deterrence, force posture, and partner support than by territorial warfare at home.",
    strategicPrograms:
      "Nuclear triad modernization, long-range strike, carrier power projection, and global ISR networks anchor U.S. capability.",
    intelligenceAssessment:
      "Washington remains globally decisive, but simultaneous theaters strain political attention and resources.",
    population: 333000000,
    gdpUsd: 27900000000000,
    militaryStrength: "Global expeditionary dominance",
    lastUpdated: "2026-04-25T00:00:00Z",
  },
  IRN: {
    countryId: 2,
    countryName: "Iran",
    isoCode: "IRN",
    politicalSystem: "Islamic republic",
    currentLeadership: "Supreme Leader-centered hybrid clerical system",
    summary:
      "Iran blends conventional deterrence, proxy influence, missile capability, and sanctions resilience to preserve regional leverage while avoiding unconstrained war.",
    warHistory:
      "Iran's modern security memory is shaped by the Iran-Iraq War, tanker confrontations, covert regional competition, and sanctions-era brinkmanship.",
    conflictRecord:
      "Its modern approach emphasizes proxies, missile signaling, and managed escalation rather than prolonged conventional offensives.",
    strategicPrograms:
      "Nuclear enrichment, ballistic missiles, drones, and partner militias are central to Iran's deterrence design.",
    intelligenceAssessment:
      "Iran is most effective when it can raise regional cost without crossing into all-out war with stronger conventional opponents.",
    population: 89000000,
    gdpUsd: 404000000000,
    militaryStrength: "Missile, drone, and proxy-centric regional deterrent",
    lastUpdated: "2026-04-25T00:00:00Z",
  },
  ISR: {
    countryId: 3,
    countryName: "Israel",
    isoCode: "ISR",
    politicalSystem: "Parliamentary democracy",
    currentLeadership: "Coalition cabinet under parliamentary system",
    summary:
      "Israel remains deeply enmeshed in regional deterrence and escalation dynamics involving Iran, Lebanon, and Gaza.",
    warHistory:
      "Israel's military history spans the 1948 war, 1967, 1973, Lebanon operations, Gaza wars, and prolonged shadow conflict with Iran.",
    conflictRecord:
      "It has sustained military superiority while facing recurrent multi-front pressure and asymmetric threats.",
    strategicPrograms:
      "Layered missile defense, advanced airpower, cyber capability, and presumed nuclear deterrence define its posture.",
    intelligenceAssessment:
      "Israel is tactically formidable but strategically vulnerable to prolonged regional escalation cycles.",
    population: 9800000,
    gdpUsd: 548000000000,
    militaryStrength: "Advanced air, missile defense, and intelligence capability",
    lastUpdated: "2026-04-24T00:00:00Z",
  },
  PAK: {
    countryId: 4,
    countryName: "Pakistan",
    isoCode: "PAK",
    politicalSystem: "Federal parliamentary republic",
    currentLeadership: "Civilian government with strong military influence",
    summary:
      "Pakistan is strategically positioned between Gulf security, Afghanistan spillover, India competition, and Chinese infrastructure alignment.",
    warHistory:
      "Pakistan's war record centers on 1947-48, 1965, 1971, Kargil, and long-running frontier and militancy campaigns.",
    conflictRecord:
      "It lost East Pakistan in 1971, but later stabilized deterrence through nuclearization and sustained rivalry management with India.",
    strategicPrograms:
      "Pakistan fields a growing nuclear deterrent, missile programs, and close defense-industrial alignment with China.",
    intelligenceAssessment:
      "Its strategy is driven by India parity concerns, domestic fragility, and the constant challenge of escalation control.",
    population: 241000000,
    gdpUsd: 338000000000,
    militaryStrength: "Nuclear-armed regional military with high mobilization depth",
    lastUpdated: "2026-04-24T00:00:00Z",
  },
};

const countryRelations: Record<string, CountryRelation[]> = {
  USA: [
    {
      id: 11,
      countryId: 1,
      countryName: "United States",
      relatedCountryId: 3,
      relatedCountryName: "Israel",
      relationType: "ALLY",
      description: "Deep military, intelligence, and diplomatic coordination.",
      strength: 9,
    },
    {
      id: 12,
      countryId: 1,
      countryName: "United States",
      relatedCountryId: 2,
      relatedCountryName: "Iran",
      relationType: "RIVAL",
      description: "Competition spans sanctions, maritime security, regional proxies, and nuclear diplomacy.",
      strength: 10,
    },
  ],
  IRN: [
    {
      id: 21,
      countryId: 2,
      countryName: "Iran",
      relatedCountryId: 3,
      relatedCountryName: "Israel",
      relationType: "RIVAL",
      description: "Direct and proxy confrontation define the regional security environment.",
      strength: 10,
    },
    {
      id: 22,
      countryId: 2,
      countryName: "Iran",
      relatedCountryId: 4,
      relatedCountryName: "Pakistan",
      relationType: "NEUTRAL",
      description: "Pragmatic neighbor relationship shaped by border security and regional energy logistics.",
      strength: 5,
    },
  ],
  PAK: [
    {
      id: 41,
      countryId: 4,
      countryName: "Pakistan",
      relatedCountryId: 2,
      relatedCountryName: "Iran",
      relationType: "NEUTRAL",
      description: "Border management and energy cooperation compete with sectarian and security sensitivities.",
      strength: 5,
    },
    {
      id: 42,
      countryId: 4,
      countryName: "Pakistan",
      relatedCountryId: 1,
      relatedCountryName: "United States",
      relationType: "TRADE_PARTNER",
      description: "Functional but uneven partnership shaped by aid, security, and macroeconomic support channels.",
      strength: 6,
    },
  ],
};

const historicalMilestones: Record<string, HistoricalMilestone[]> = {
  USA: [
    {
      id: 5001,
      year: 1776,
      title: "Declaration of Independence",
      description: "The Thirteen Colonies declared independence from Great Britain, establishing the United States of America as a sovereign nation and setting the foundation for a constitutional republic.",
      category: "INDEPENDENCE",
      references: [
        { title: "The Declaration of Independence: A History", source: "National Archives", url: "https://www.archives.gov/founding-docs/declaration-history" },
        { title: "American Revolution", source: "Britannica", url: "https://www.britannica.com/event/American-Revolution" },
      ],
    },
    {
      id: 5002,
      year: 1945,
      title: "First nuclear weapons used in warfare",
      description: "The United States became the first and only country to use nuclear weapons in combat, dropping atomic bombs on Hiroshima and Nagasaki, leading to Japan's surrender and the end of World War II.",
      category: "NUCLEAR",
      references: [
        { title: "The Manhattan Project", source: "U.S. Department of Energy", url: "https://www.energy.gov/lm/manhattan-project" },
        { title: "Bombings of Hiroshima and Nagasaki", source: "Atomic Heritage Foundation", url: "https://ahf.nuclearmuseum.org/ahf/history/bombings-hiroshima-and-nagasaki/" },
      ],
    },
    {
      id: 5003,
      year: 1991,
      title: "Gulf War and post-Cold War unipolar moment",
      description: "Coalition forces led by the U.S. liberated Kuwait from Iraqi occupation. The Soviet Union dissolved the same year, leaving the U.S. as the sole superpower in a unipolar world order.",
      category: "WAR",
      references: [
        { title: "The Gulf War", source: "Council on Foreign Relations", url: "https://www.cfr.org/timeline/gulf-war" },
        { title: "End of the Cold War", source: "U.S. State Department", url: "https://history.state.gov/milestones/1989-1992/end-of-cold-war" },
      ],
    },
    {
      id: 5004,
      year: 2001,
      title: "9/11 attacks and the Global War on Terror",
      description: "The September 11 attacks killed nearly 3,000 people, prompting the U.S. to launch military operations in Afghanistan and later Iraq, reshaping its foreign policy and defense posture for decades.",
      category: "WAR",
      references: [
        { title: "9/11 Commission Report", source: "National Commission on Terrorist Attacks", url: "https://www.9-11commission.gov/report/" },
        { title: "U.S. War in Afghanistan", source: "Council on Foreign Relations", url: "https://www.cfr.org/timeline/us-war-afghanistan" },
      ],
      eventId: "us-nine-eleven-2001",
    },
  ],
  IRN: [
    {
      id: 5101,
      year: 1953,
      title: "CIA-backed coup overthrows Mossadegh",
      description: "Operation TPAJAX toppled democratically elected Prime Minister Mohammad Mossadegh, restoring Shah Pahlavi's power. This event seeded deep anti-Western sentiment that shapes Iranian politics to this day.",
      category: "COUP",
      references: [
        { title: "CIA confirms role in 1953 Iran coup", source: "The Guardian", url: "https://www.theguardian.com/world/2013/aug/19/cia-admits-role-1953-iranian-coup" },
        { title: "Declassified CIA documents on the coup", source: "National Security Archive", url: "https://nsarchive2.gwu.edu/NSAEBB/NSAEBB435/" },
      ],
      eventId: "cia-coup-iran-1953",
    },
    {
      id: 5102,
      year: 1979,
      title: "Islamic Revolution and U.S. Embassy hostage crisis",
      description: "The Shah was overthrown and Ayatollah Khomeini established an Islamic republic. Militants seized the U.S. Embassy in Tehran, holding 52 Americans hostage for 444 days, severing diplomatic ties.",
      category: "REVOLUTION",
      references: [
        { title: "The Iranian Revolution", source: "Britannica", url: "https://www.britannica.com/event/Iranian-Revolution" },
        { title: "Iran Hostage Crisis", source: "U.S. State Department", url: "https://history.state.gov/milestones/1977-1980/iran-hostage-crisis" },
      ],
      eventId: "iran-revolution-1979",
    },
    {
      id: 5103,
      year: 1988,
      title: "End of Iran-Iraq War",
      description: "After eight years of devastating warfare with Iraq (1980-1988) that killed an estimated 500,000 people on both sides, Iran accepted UN Resolution 598. The war cemented Iran's distrust of international institutions.",
      category: "WAR",
      references: [
        { title: "Iran-Iraq War", source: "Council on Foreign Relations", url: "https://www.cfr.org/backgrounder/iran-iraq-war" },
        { title: "Iran-Iraq War (1980-1988)", source: "Britannica", url: "https://www.britannica.com/event/Iran-Iraq-War" },
      ],
      eventId: "iran-iraq-war-1988",
    },
    {
      id: 5104,
      year: 2015,
      title: "JCPOA nuclear deal signed",
      description: "Iran and the P5+1 reached the Joint Comprehensive Plan of Action, limiting Iran's nuclear enrichment in exchange for sanctions relief. The U.S. withdrew from the deal in 2018 under the Trump administration.",
      category: "DIPLOMACY",
      references: [
        { title: "The Iran Nuclear Deal: A Definitive Guide", source: "Belfer Center, Harvard", url: "https://www.belfercenter.org/iran-deal-guide" },
        { title: "Joint Comprehensive Plan of Action", source: "U.S. State Department", url: "https://2009-2017.state.gov/e/eb/tfs/spi/iran/jcpoa/index.htm" },
      ],
      eventId: "jcpoa-nuclear-deal-2015",
    },
  ],
  PAK: [
    {
      id: 5201,
      year: 1947,
      title: "Independence and Partition",
      description: "Pakistan was created as an independent Muslim-majority state following the partition of British India, leading to one of the largest mass migrations in history and communal violence that killed hundreds of thousands.",
      category: "INDEPENDENCE",
      references: [
        { title: "Partition of India", source: "Britannica", url: "https://www.britannica.com/event/partition-of-India" },
        { title: "The Great Partition", source: "BBC History", url: "https://www.bbc.co.uk/history/british/modern/partition1947_01.shtml" },
      ],
      eventId: "pakistan-independence-1947",
    },
    {
      id: 5202,
      year: 1971,
      title: "Fall of Dhaka and loss of East Pakistan",
      description: "East Pakistan seceded to become Bangladesh after a civil war and Indian military intervention. The defeat was Pakistan's most significant territorial loss and reshaped its strategic calculus permanently.",
      category: "TERRITORIAL",
      references: [
        { title: "The 1971 War and the Birth of Bangladesh", source: "Council on Foreign Relations", url: "https://www.cfr.org/backgrounder/indo-pakistani-war-1971" },
        { title: "Liberation War of Bangladesh", source: "Britannica", url: "https://www.britannica.com/event/Bangladesh-Liberation-War" },
      ],
      eventId: "fall-of-dhaka-1971",
    },
    {
      id: 5203,
      year: 1998,
      title: "Pakistan becomes a nuclear power",
      description: "Pakistan conducted five underground nuclear tests at Chagai Hills (Chagai-I), becoming the seventh declared nuclear state and the first in the Muslim world. The tests were a direct response to India's Pokhran-II tests weeks earlier.",
      category: "NUCLEAR",
      references: [
        { title: "Pakistan Nuclear Weapons Program", source: "Nuclear Threat Initiative", url: "https://www.nti.org/analysis/articles/pakistan-nuclear/" },
        { title: "Pakistan's Nuclear Tests, 1998", source: "Atomic Heritage Foundation", url: "https://ahf.nuclearmuseum.org/ahf/history/pakistans-nuclear-tests-1998/" },
        { title: "Chagai-I: The Day Pakistan Went Nuclear", source: "Dawn", url: "https://www.dawn.com/news/1408282" },
      ],
      eventId: "pakistan-nuclear-tests-1998",
    },
    {
      id: 5204,
      year: 1999,
      title: "Kargil War with India",
      description: "Pakistani soldiers and militants infiltrated Indian-controlled Kargil sector in Kashmir. India launched a counteroffensive, and international pressure led to Pakistan's withdrawal. The crisis raised global nuclear war fears.",
      category: "WAR",
      references: [
        { title: "The Kargil War", source: "Stimson Center", url: "https://www.stimson.org/content/kargil-crisis" },
        { title: "Kargil War 1999", source: "Britannica", url: "https://www.britannica.com/event/Kargil-War" },
      ],
      eventId: "kargil-war-1999",
    },
    {
      id: 5205,
      year: 2004,
      title: "A.Q. Khan nuclear proliferation network exposed",
      description: "Dr. Abdul Qadeer Khan, the architect of Pakistan's nuclear program, admitted to running a clandestine network that sold nuclear technology to Libya, Iran, and North Korea, triggering a global non-proliferation crisis.",
      category: "NUCLEAR",
      references: [
        { title: "The A.Q. Khan Network", source: "IISS", url: "https://www.iiss.org/publications/strategic-dossiers/nuclear-black-markets" },
        { title: "A.Q. Khan and Nuclear Proliferation", source: "Arms Control Association", url: "https://www.armscontrol.org/act/2004-03/features/aq-khan-nuclear-network" },
      ],
    },
  ],
  ISR: [
    {
      id: 5301,
      year: 1948,
      title: "Declaration of independence and first Arab-Israeli War",
      description: "Israel declared independence on May 14, 1948. Neighboring Arab states immediately invaded. Israel prevailed and expanded beyond the UN partition plan borders, while 700,000 Palestinians were displaced.",
      category: "INDEPENDENCE",
      references: [
        { title: "1948 Arab-Israeli War", source: "Britannica", url: "https://www.britannica.com/event/Arab-Israeli-wars" },
        { title: "Israel's War of Independence", source: "Council on Foreign Relations", url: "https://www.cfr.org/timeline/israeli-palestinian-conflict" },
      ],
    },
    {
      id: 5302,
      year: 1967,
      title: "Six-Day War and territorial expansion",
      description: "Israel launched a preemptive strike against Egypt, Syria, and Jordan, capturing the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights in just six days. These territories remain central to ongoing conflicts.",
      category: "WAR",
      references: [
        { title: "Six-Day War", source: "Britannica", url: "https://www.britannica.com/event/Six-Day-War" },
        { title: "The 1967 War and its Aftermath", source: "U.S. State Department", url: "https://history.state.gov/milestones/1961-1968/arab-israeli-war-1967" },
      ],
      eventId: "israel-six-day-war-1967",
    },
    {
      id: 5303,
      year: 1979,
      title: "Camp David Accords and peace with Egypt",
      description: "Israel and Egypt signed the Camp David Accords, the first peace treaty between Israel and an Arab state. Israel returned the Sinai Peninsula; Egypt recognized Israel. A landmark in Middle Eastern diplomacy.",
      category: "DIPLOMACY",
      references: [
        { title: "Camp David Accords", source: "Jimmy Carter Library", url: "https://www.jimmycarterlibrary.gov/research/camp-david-accords" },
        { title: "Camp David Accords and the Israeli-Egyptian Peace Treaty", source: "U.S. State Department", url: "https://history.state.gov/milestones/1977-1980/camp-david" },
      ],
      eventId: "camp-david-accords-1979",
    },
    {
      id: 5304,
      year: 1986,
      title: "Nuclear capability revealed by Mordechai Vanunu",
      description: "Former nuclear technician Mordechai Vanunu leaked details of Israel's secret nuclear weapons program to the British press, confirming Israel possessed an estimated 100-200 nuclear warheads. Israel maintains a policy of nuclear ambiguity.",
      category: "NUCLEAR",
      references: [
        { title: "Israel and Nuclear Weapons", source: "Nuclear Threat Initiative", url: "https://www.nti.org/analysis/articles/israel-nuclear/" },
        { title: "The Vanunu Revelations", source: "Bulletin of the Atomic Scientists", url: "https://thebulletin.org/2016/09/the-vanunu-revelations/" },
      ],
    },
  ],
};

export const historicalEvents: HistoricalEvent[] = [
  {
    id: "cia-coup-iran-1953",
    title: "CIA-Backed Coup Overthrows Mossadegh",
    year: 1953,
    category: "COUP",
    region: "Middle East",
    overview: "In August 1953, the CIA and British MI6 orchestrated Operation TPAJAX, which overthrew Iran's democratically elected Prime Minister Mohammad Mossadegh. The coup restored the autocratic rule of Shah Mohammad Reza Pahlavi and secured Western access to Iranian oil. It remains one of the most consequential covert operations in Cold War history and a defining grievance in Iranian political memory.",
    causes: "Mossadegh nationalized the Anglo-Iranian Oil Company (AIOC, later BP) in 1951, threatening British petroleum revenues. When Britain imposed an embargo, the Eisenhower administration was persuaded that Mossadegh's government could fall to communist influence. The CIA planned the coup in coordination with MI6 and Iranian military officers loyal to the Shah.",
    outcome: "The Shah's power was restored and consolidated. He ruled for 26 more years with increasing authoritarianism, backed by U.S. support and the SAVAK secret police. The coup seeded the deep anti-Western sentiment that fueled the 1979 Islamic Revolution. The CIA officially acknowledged its role in declassified documents released in 2013.",
    participants: [
      { countryId: 2, countryName: "Iran", isoCode: "IRN", role: "PRIMARY", description: "The elected government was overthrown; Mossadegh was arrested and spent the rest of his life under house arrest" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "PRIMARY", description: "CIA planned and executed the coup through Operation TPAJAX" },
    ],
    timeline: [
      { date: "1951-04-28", title: "Oil nationalization", description: "Iranian parliament voted to nationalize the Anglo-Iranian Oil Company under Mossadegh's leadership." },
      { date: "1953-06-01", title: "Operation TPAJAX approved", description: "The Eisenhower administration authorized the CIA to proceed with the coup plan." },
      { date: "1953-08-15", title: "First coup attempt fails", description: "The initial plan faltered when loyalist officers tipped off Mossadegh. The Shah fled to Baghdad." },
      { date: "1953-08-19", title: "Coup succeeds", description: "CIA-organized street mobs, bribed military units, and propaganda overwhelmed Mossadegh's supporters. He surrendered." },
      { date: "1953-08-22", title: "Shah returns", description: "Mohammad Reza Pahlavi returned to Tehran and consolidated absolute power." },
    ],
    linkedConflictIds: [1],
    linkedEventIds: ["iran-revolution-1979", "jcpoa-nuclear-deal-2015"],
    references: [
      { title: "CIA confirms role in 1953 Iran coup", source: "The Guardian", url: "https://www.theguardian.com/world/2013/aug/19/cia-admits-role-1953-iranian-coup" },
      { title: "Declassified CIA documents on the coup", source: "National Security Archive", url: "https://nsarchive2.gwu.edu/NSAEBB/NSAEBB435/" },
    ],
    significance: "DEFINING",
  },
  {
    id: "iran-revolution-1979",
    title: "Islamic Revolution and U.S. Embassy Hostage Crisis",
    year: 1979,
    category: "REVOLUTION",
    region: "Middle East",
    overview: "The Iranian Revolution of 1979 overthrew the Western-backed Shah Mohammad Reza Pahlavi and established an Islamic republic under Ayatollah Ruhollah Khomeini. The revolution fundamentally altered the geopolitical landscape of the Middle East, ended Iran's alliance with the United States, and introduced a theocratic governance model that persists today. Militants seized the U.S. Embassy in Tehran on November 4, 1979, holding 52 American diplomats hostage for 444 days.",
    causes: "Widespread opposition to the Shah's authoritarian rule, resentment of the 1953 CIA-backed coup that had restored him, anger over SAVAK secret police brutality, economic inequality despite oil wealth, and Khomeini's religious authority uniting secular and religious opposition movements.",
    outcome: "Iran became an Islamic republic. U.S.-Iran diplomatic relations were severed and have not been formally restored. The hostage crisis contributed to President Carter's electoral defeat. Iran's new government pursued an independent foreign policy that put it at odds with both superpowers and reshaped regional alliances for decades.",
    participants: [
      { countryId: 2, countryName: "Iran", isoCode: "IRN", role: "PRIMARY", description: "The revolution occurred within Iran, overthrowing the Pahlavi monarchy" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "AFFECTED", description: "Lost its key Middle Eastern ally; 52 diplomats held hostage for 444 days" },
      { countryId: 3, countryName: "Israel", isoCode: "ISR", role: "AFFECTED", description: "Lost a regional partner; Iran transitioned from ally to existential adversary" },
    ],
    timeline: [
      { date: "1978-01-07", title: "Qom protests", description: "Security forces fired on protesters in Qom, killing several theology students and triggering a cycle of mourning protests." },
      { date: "1978-09-08", title: "Black Friday massacre", description: "Troops opened fire on demonstrators in Tehran's Jaleh Square, killing dozens and radicalizing the opposition." },
      { date: "1979-01-16", title: "Shah flees Iran", description: "Mohammad Reza Pahlavi left Iran permanently, ending the Pahlavi dynasty." },
      { date: "1979-02-01", title: "Khomeini returns", description: "Ayatollah Khomeini returned to Tehran from exile in Paris, greeted by millions." },
      { date: "1979-02-11", title: "Revolution succeeds", description: "The military declared neutrality. Revolutionary forces seized government buildings." },
      { date: "1979-04-01", title: "Islamic Republic declared", description: "A national referendum approved the establishment of an Islamic republic by 98% vote." },
      { date: "1979-11-04", title: "U.S. Embassy seized", description: "Militant students stormed the U.S. Embassy in Tehran, beginning the 444-day hostage crisis." },
    ],
    linkedConflictIds: [1],
    linkedEventIds: ["cia-coup-iran-1953", "iran-iraq-war-1988"],
    references: [
      { title: "The Iranian Revolution", source: "Britannica", url: "https://www.britannica.com/event/Iranian-Revolution" },
      { title: "Iran Hostage Crisis", source: "U.S. State Department", url: "https://history.state.gov/milestones/1977-1980/iran-hostage-crisis" },
    ],
    significance: "DEFINING",
  },
  {
    id: "iran-iraq-war-1988",
    title: "Iran-Iraq War",
    year: 1980,
    endYear: 1988,
    category: "WAR",
    region: "Middle East",
    overview: "The Iran-Iraq War (1980-1988) was one of the longest and deadliest conventional wars of the 20th century. Iraq, under Saddam Hussein, invaded Iran in September 1980, seeking to exploit the post-revolutionary chaos. The war devolved into trench warfare reminiscent of World War I, with both sides using chemical weapons. An estimated 500,000-1,000,000 people died.",
    causes: "Saddam Hussein sought to exploit Iran's post-revolutionary instability, claim the oil-rich Khuzestan province, and prevent the spread of Islamic revolution to Iraq's Shia majority. Border disputes over the Shatt al-Arab waterway provided the territorial pretext.",
    outcome: "The war ended in a stalemate with UN Resolution 598. Iran's economy was devastated, cementing its distrust of international institutions. Iraq emerged heavily indebted, which contributed to Saddam's decision to invade Kuwait in 1990. The war shaped Iran's military doctrine around self-reliance, asymmetric capabilities, and missile programs.",
    participants: [
      { countryId: 2, countryName: "Iran", isoCode: "IRN", role: "PRIMARY", description: "Defended against Iraqi invasion; suffered massive casualties and economic devastation" },
    ],
    timeline: [
      { date: "1980-09-22", title: "Iraq invades Iran", description: "Iraqi forces launched a full-scale invasion across the border, bombing Iranian airfields and advancing into Khuzestan." },
      { date: "1982-05-24", title: "Iran recaptures Khorramshahr", description: "Iran liberated the strategic port city, turning the tide of the war and pushing Iraqi forces back across the border." },
      { date: "1984-01-01", title: "Tanker War begins", description: "Both sides began attacking oil tankers in the Persian Gulf, threatening global energy supplies." },
      { date: "1987-07-20", title: "UN Resolution 598", description: "The UN Security Council passed Resolution 598 calling for a ceasefire, which Iran initially rejected." },
      { date: "1988-07-18", title: "Iran accepts ceasefire", description: "Khomeini accepted the ceasefire, calling it 'more deadly than taking poison.' The war effectively ended." },
    ],
    linkedConflictIds: [1],
    linkedEventIds: ["iran-revolution-1979", "jcpoa-nuclear-deal-2015"],
    references: [
      { title: "Iran-Iraq War", source: "Council on Foreign Relations", url: "https://www.cfr.org/backgrounder/iran-iraq-war" },
      { title: "Iran-Iraq War (1980-1988)", source: "Britannica", url: "https://www.britannica.com/event/Iran-Iraq-War" },
    ],
    significance: "DEFINING",
  },
  {
    id: "jcpoa-nuclear-deal-2015",
    title: "JCPOA Nuclear Deal",
    year: 2015,
    category: "DIPLOMACY",
    region: "Middle East",
    overview: "The Joint Comprehensive Plan of Action (JCPOA) was a landmark nuclear agreement between Iran and the P5+1 (United States, United Kingdom, France, Russia, China, and Germany). Iran agreed to limit its nuclear enrichment program and accept inspections in exchange for the lifting of international sanctions. The deal was the product of years of intense diplomacy and represented the most significant U.S.-Iran engagement since 1979.",
    causes: "Iran's nuclear enrichment program had been expanding for over a decade, raising international concerns about potential weapons development. Severe international sanctions crippled Iran's economy. The election of President Rouhani in 2013 on a platform of engagement, combined with the Obama administration's diplomatic overtures, created a window for negotiations.",
    outcome: "The JCPOA temporarily constrained Iran's nuclear program and provided sanctions relief. However, the Trump administration withdrew the U.S. from the deal in May 2018 and reimposed sanctions under a 'maximum pressure' campaign. Iran subsequently resumed enrichment activities beyond JCPOA limits. Efforts to revive the deal have stalled, and the agreement's future remains uncertain.",
    participants: [
      { countryId: 2, countryName: "Iran", isoCode: "IRN", role: "PRIMARY", description: "Agreed to limit nuclear enrichment in exchange for sanctions relief" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "PRIMARY", description: "Led P5+1 negotiations; later withdrew from the deal under Trump administration" },
      { countryId: 3, countryName: "Israel", isoCode: "ISR", role: "OPPONENT", description: "Strongly opposed the deal, arguing it did not adequately constrain Iran's nuclear ambitions" },
    ],
    timeline: [
      { date: "2013-09-27", title: "Rouhani-Obama phone call", description: "The first direct communication between U.S. and Iranian leaders since 1979, signaling diplomatic opening." },
      { date: "2013-11-24", title: "Interim agreement signed", description: "The Joint Plan of Action froze parts of Iran's nuclear program during negotiations." },
      { date: "2015-07-14", title: "JCPOA finalized", description: "After 20 months of negotiations, the P5+1 and Iran reached a comprehensive nuclear agreement in Vienna." },
      { date: "2016-01-16", title: "Implementation Day", description: "IAEA verified Iran's compliance and sanctions were lifted." },
      { date: "2018-05-08", title: "U.S. withdraws", description: "President Trump announced U.S. withdrawal from the JCPOA, calling it 'a horrible, one-sided deal.'" },
    ],
    linkedConflictIds: [1],
    linkedEventIds: ["iran-revolution-1979", "cia-coup-iran-1953"],
    references: [
      { title: "The Iran Nuclear Deal: A Definitive Guide", source: "Belfer Center, Harvard", url: "https://www.belfercenter.org/iran-deal-guide" },
      { title: "Joint Comprehensive Plan of Action", source: "U.S. State Department", url: "https://2009-2017.state.gov/e/eb/tfs/spi/iran/jcpoa/index.htm" },
    ],
    significance: "DEFINING",
  },
  {
    id: "pakistan-independence-1947",
    title: "Independence and Partition of British India",
    year: 1947,
    category: "INDEPENDENCE",
    region: "South Asia",
    overview: "On August 14, 1947, Pakistan was created as an independent Muslim-majority state following the partition of British India. The partition triggered one of the largest mass migrations in history, with an estimated 10-15 million people displaced and up to one million killed in communal violence. Pakistan was born as a geographically divided nation, with West Pakistan and East Pakistan separated by 1,600 km of Indian territory.",
    causes: "The demand for a separate Muslim state grew from the Two-Nation Theory championed by the Muslim League under Muhammad Ali Jinnah. Decades of Hindu-Muslim political tension, the failure of power-sharing arrangements, and the British decision to accelerate withdrawal created the conditions for partition. The Radcliffe Line was drawn hastily, dividing communities, families, and resources.",
    outcome: "Pakistan emerged as a sovereign nation but faced immediate challenges: integrating millions of refugees, establishing governance institutions from scratch, and confronting India over the princely state of Kashmir. The first Indo-Pakistani War erupted within months. The geographic separation of West and East Pakistan planted the seeds for the 1971 breakup.",
    participants: [
      { countryId: 4, countryName: "Pakistan", isoCode: "PAK", role: "PRIMARY", description: "Created as an independent Muslim-majority nation from the partition of British India" },
    ],
    timeline: [
      { date: "1940-03-23", title: "Lahore Resolution", description: "The Muslim League adopted the resolution demanding separate Muslim states, laying the political foundation for Pakistan." },
      { date: "1947-06-03", title: "Mountbatten Plan announced", description: "Lord Mountbatten announced the plan to partition British India into two independent dominions." },
      { date: "1947-08-14", title: "Pakistan gains independence", description: "Pakistan was born as a sovereign nation. Muhammad Ali Jinnah became the first Governor-General." },
      { date: "1947-08-15", title: "India gains independence", description: "India became independent the following day, completing the partition." },
      { date: "1947-10-27", title: "First Kashmir War begins", description: "Indian troops airlifted to Kashmir after tribal invasion, beginning the first Indo-Pakistani conflict." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["fall-of-dhaka-1971", "pakistan-nuclear-tests-1998"],
    references: [
      { title: "Partition of India", source: "Britannica", url: "https://www.britannica.com/event/partition-of-India" },
      { title: "The Great Partition", source: "BBC History", url: "https://www.bbc.co.uk/history/british/modern/partition1947_01.shtml" },
    ],
    significance: "DEFINING",
  },
  {
    id: "fall-of-dhaka-1971",
    title: "Fall of Dhaka and Birth of Bangladesh",
    year: 1971,
    category: "TERRITORIAL",
    region: "South Asia",
    overview: "In December 1971, East Pakistan seceded to become Bangladesh after a brutal civil war and Indian military intervention. The conflict began when the Pakistani military launched Operation Searchlight to suppress the Bengali independence movement, leading to widespread atrocities. India intervened militarily in December, and Pakistani forces in the east surrendered within two weeks. It was Pakistan's most devastating defeat.",
    causes: "Deep economic and political grievances in East Pakistan, where the Bengali majority felt exploited by West Pakistan's elite. The 1970 elections gave the Awami League a landslide victory, but the military government refused to transfer power. Operation Searchlight targeted Bengali intellectuals, students, and civilians, triggering a mass refugee crisis that drew India into the conflict.",
    outcome: "Bangladesh became an independent nation. Pakistan lost more than half its population and significant economic resources. Over 90,000 Pakistani soldiers became prisoners of war. The defeat led to the fall of the Yahya Khan military government and brought Zulfikar Ali Bhutto to power. Pakistan's strategic calculus shifted permanently toward nuclear deterrence and rivalry management with India.",
    participants: [
      { countryId: 4, countryName: "Pakistan", isoCode: "PAK", role: "PRIMARY", description: "Lost East Pakistan; 90,000 soldiers surrendered to Indian forces" },
    ],
    timeline: [
      { date: "1970-12-07", title: "Awami League wins election", description: "Sheikh Mujibur Rahman's party won a commanding majority in national elections, which the military refused to honor." },
      { date: "1971-03-25", title: "Operation Searchlight", description: "The Pakistani military launched a brutal crackdown in East Pakistan, targeting civilians and intellectuals." },
      { date: "1971-03-26", title: "Bangladesh declares independence", description: "Sheikh Mujibur Rahman declared independence, marking the formal birth of the Bangladesh liberation movement." },
      { date: "1971-12-03", title: "India enters the war", description: "India launched a full-scale military intervention in East Pakistan after months of refugee crisis." },
      { date: "1971-12-16", title: "Pakistan surrenders", description: "Pakistani forces in Dhaka surrendered unconditionally to the Indian military. Bangladesh was liberated." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["pakistan-independence-1947", "pakistan-nuclear-tests-1998"],
    references: [
      { title: "The 1971 War and the Birth of Bangladesh", source: "Council on Foreign Relations", url: "https://www.cfr.org/backgrounder/indo-pakistani-war-1971" },
      { title: "Liberation War of Bangladesh", source: "Britannica", url: "https://www.britannica.com/event/Bangladesh-Liberation-War" },
    ],
    significance: "DEFINING",
  },
  {
    id: "pakistan-nuclear-tests-1998",
    title: "Pakistan Becomes a Nuclear Power (Chagai-I)",
    year: 1998,
    category: "NUCLEAR",
    region: "South Asia",
    overview: "On May 28, 1998, Pakistan conducted five simultaneous underground nuclear tests at the Ras Koh Hills in the Chagai district of Balochistan, becoming the seventh declared nuclear weapons state and the first in the Muslim world. The tests were a direct response to India's Pokhran-II nuclear tests conducted 17 days earlier. A sixth test followed two days later at a separate site in the Kharan desert.",
    causes: "India's surprise Pokhran-II nuclear tests on May 11, 1998 created enormous domestic and strategic pressure on Pakistan to demonstrate matching capability. Pakistan's nuclear program had been underway since the 1970s, driven by the trauma of the 1971 war with India. A.Q. Khan's centrifuge program had been secretly enriching uranium for over two decades.",
    outcome: "Pakistan established credible nuclear deterrence against India, fundamentally altering the South Asian security balance. Both countries faced international sanctions. The tests accelerated the global non-proliferation debate. Pakistan's nuclear arsenal has since grown to an estimated 170 warheads, making it one of the fastest-growing nuclear programs in the world.",
    participants: [
      { countryId: 4, countryName: "Pakistan", isoCode: "PAK", role: "PRIMARY", description: "Conducted six nuclear tests at Chagai Hills and Kharan desert, declaring itself a nuclear state" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "OPPONENT", description: "Imposed sanctions under the Glenn Amendment; had pressured Pakistan not to test" },
    ],
    timeline: [
      { date: "1998-05-11", title: "India conducts Pokhran-II", description: "India detonated five nuclear devices, creating immense pressure on Pakistan to respond." },
      { date: "1998-05-14", title: "Pakistan cabinet debates", description: "Emergency cabinet sessions debated testing despite U.S. pressure and sanctions threats." },
      { date: "1998-05-28", title: "Chagai-I: Five tests", description: "Pakistan detonated five nuclear devices simultaneously at Ras Koh Hills. PM Sharif declared: 'Today we have settled the score.'" },
      { date: "1998-05-30", title: "Chagai-II: Sixth test", description: "A sixth test conducted at Kharan desert to demonstrate weapon diversity." },
      { date: "1998-06-01", title: "International sanctions imposed", description: "The U.S., Japan, and other nations imposed economic sanctions on both India and Pakistan." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["fall-of-dhaka-1971", "kargil-war-1999"],
    references: [
      { title: "Pakistan Nuclear Weapons Program", source: "Nuclear Threat Initiative", url: "https://www.nti.org/analysis/articles/pakistan-nuclear/" },
      { title: "Pakistan's Nuclear Tests, 1998", source: "Atomic Heritage Foundation", url: "https://ahf.nuclearmuseum.org/ahf/history/pakistans-nuclear-tests-1998/" },
      { title: "Chagai-I: The Day Pakistan Went Nuclear", source: "Dawn", url: "https://www.dawn.com/news/1408282" },
    ],
    significance: "DEFINING",
  },
  {
    id: "kargil-war-1999",
    title: "Kargil War",
    year: 1999,
    category: "WAR",
    region: "South Asia",
    overview: "In the summer of 1999, Pakistani soldiers and militants infiltrated the Indian-controlled Kargil sector of Kashmir, occupying strategic mountain positions along the Line of Control. India launched a major counteroffensive (Operation Vijay) combining ground assaults with air strikes. The conflict raised global fears of nuclear war between two newly declared nuclear states and ended with Pakistan's withdrawal under intense international pressure.",
    causes: "Pakistan sought to alter the Line of Control in Kashmir and internationalize the Kashmir dispute. The operation was planned by the Pakistani military leadership, reportedly without full civilian government knowledge. The strategic calculation was that nuclear deterrence would prevent India from escalating beyond Kargil.",
    outcome: "India recaptured all infiltrated positions. Pakistan faced diplomatic isolation and economic pressure. The crisis demonstrated that nuclear weapons did not prevent conventional conflict in South Asia. In Pakistan, the military's handling of Kargil contributed to the October 1999 coup that brought General Musharraf to power.",
    participants: [
      { countryId: 4, countryName: "Pakistan", isoCode: "PAK", role: "PRIMARY", description: "Military forces infiltrated Kargil; later withdrew under international pressure" },
    ],
    timeline: [
      { date: "1999-05-03", title: "Infiltration discovered", description: "Indian shepherds reported armed intruders in the Kargil heights. Indian patrols confirmed Pakistani military positions." },
      { date: "1999-05-26", title: "India launches air strikes", description: "Indian Air Force began Operation Safed Sagar, conducting air strikes against Pakistani positions in the mountains." },
      { date: "1999-06-13", title: "Battle of Tololing", description: "Indian forces captured the strategic Tololing ridge after fierce combat at 16,000 feet altitude." },
      { date: "1999-07-04", title: "Tiger Hill recaptured", description: "India recaptured the iconic Tiger Hill in one of the war's decisive battles." },
      { date: "1999-07-26", title: "Pakistan withdraws", description: "Following PM Sharif's meeting with President Clinton, Pakistan announced withdrawal. India declared victory." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["pakistan-nuclear-tests-1998", "fall-of-dhaka-1971"],
    references: [
      { title: "The Kargil War", source: "Stimson Center", url: "https://www.stimson.org/content/kargil-crisis" },
      { title: "Kargil War 1999", source: "Britannica", url: "https://www.britannica.com/event/Kargil-War" },
    ],
    significance: "MAJOR",
  },
  {
    id: "israel-six-day-war-1967",
    title: "Six-Day War",
    year: 1967,
    category: "WAR",
    region: "Middle East",
    overview: "In June 1967, Israel launched a preemptive military strike against Egypt, Syria, and Jordan, achieving one of the most decisive victories in modern military history. In just six days, Israel captured the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights — tripling its territory. The war fundamentally reshaped the Middle Eastern geopolitical map, and the occupied territories remain at the center of the Israeli-Palestinian conflict today.",
    causes: "Egyptian President Nasser's closure of the Straits of Tiran to Israeli shipping, the massing of Egyptian troops in Sinai, the expulsion of UN peacekeepers, and mutual defense pacts between Egypt, Syria, and Jordan created what Israel perceived as an existential threat requiring preemptive action.",
    outcome: "Israel gained control of strategically vital territory and established itself as the dominant military power in the region. The war created the Palestinian refugee crisis in the West Bank and Gaza, set the stage for the 1973 Yom Kippur War, and made territorial negotiations the central issue of Arab-Israeli diplomacy for decades.",
    participants: [
      { countryId: 3, countryName: "Israel", isoCode: "ISR", role: "PRIMARY", description: "Launched preemptive strikes and captured territory from three neighboring states" },
    ],
    timeline: [
      { date: "1967-05-22", title: "Straits of Tiran closed", description: "Egypt closed the Straits of Tiran to Israeli shipping, which Israel had declared would be an act of war." },
      { date: "1967-05-30", title: "Jordan joins pact", description: "King Hussein of Jordan signed a mutual defense pact with Egypt, completing the encirclement." },
      { date: "1967-06-05", title: "Israel strikes", description: "Israeli Air Force destroyed the Egyptian air force on the ground in a surprise dawn attack, achieving total air superiority." },
      { date: "1967-06-07", title: "Jerusalem captured", description: "Israeli paratroopers captured East Jerusalem and the Old City, including the Western Wall." },
      { date: "1967-06-10", title: "Ceasefire", description: "Fighting ended after Israel captured the Golan Heights from Syria. The war concluded in six days." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["camp-david-accords-1979"],
    references: [
      { title: "Six-Day War", source: "Britannica", url: "https://www.britannica.com/event/Six-Day-War" },
      { title: "The 1967 War and its Aftermath", source: "U.S. State Department", url: "https://history.state.gov/milestones/1961-1968/arab-israeli-war-1967" },
    ],
    significance: "DEFINING",
  },
  {
    id: "camp-david-accords-1979",
    title: "Camp David Accords",
    year: 1979,
    category: "DIPLOMACY",
    region: "Middle East",
    overview: "The Camp David Accords, signed in September 1978 and formalized into a peace treaty in March 1979, were the first peace agreement between Israel and an Arab state. Brokered by U.S. President Jimmy Carter, the accords saw Egypt recognize Israel and Israel return the Sinai Peninsula to Egypt. The agreement fundamentally altered the strategic balance in the Middle East by removing the largest Arab military from the conflict equation.",
    causes: "Egyptian President Anwar Sadat's historic visit to Jerusalem in November 1977 broke the psychological barrier between the two nations. Egypt sought the return of Sinai, economic relief, and a closer relationship with the United States. Israel sought security through peace with its most powerful neighbor. President Carter invested enormous political capital in mediating 13 days of intensive negotiations at Camp David.",
    outcome: "Egypt regained the Sinai Peninsula and became the second-largest recipient of U.S. foreign aid. Israel secured its southern border, freeing military resources for other fronts. However, Egypt was expelled from the Arab League and Sadat was assassinated in 1981. The accords did not resolve the Palestinian question, which remains the core of the conflict.",
    participants: [
      { countryId: 3, countryName: "Israel", isoCode: "ISR", role: "PRIMARY", description: "Returned Sinai Peninsula to Egypt in exchange for full diplomatic recognition and peace" },
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "MEDIATOR", description: "President Carter brokered the negotiations over 13 days at Camp David" },
    ],
    timeline: [
      { date: "1977-11-19", title: "Sadat visits Jerusalem", description: "Egyptian President Sadat became the first Arab leader to visit Israel, addressing the Knesset and breaking decades of hostility." },
      { date: "1978-09-05", title: "Camp David negotiations begin", description: "Carter, Sadat, and Begin began 13 days of intensive negotiations at the presidential retreat." },
      { date: "1978-09-17", title: "Accords signed", description: "The Camp David Accords were signed at the White House, establishing a framework for peace." },
      { date: "1979-03-26", title: "Peace treaty signed", description: "The formal Egypt-Israel peace treaty was signed at the White House, ending 31 years of conflict." },
      { date: "1982-04-25", title: "Sinai returned", description: "Israel completed its withdrawal from the Sinai Peninsula, fulfilling the treaty terms." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["israel-six-day-war-1967"],
    references: [
      { title: "Camp David Accords", source: "Jimmy Carter Library", url: "https://www.jimmycarterlibrary.gov/research/camp-david-accords" },
      { title: "Camp David Accords and the Israeli-Egyptian Peace Treaty", source: "U.S. State Department", url: "https://history.state.gov/milestones/1977-1980/camp-david" },
    ],
    significance: "DEFINING",
  },
  {
    id: "us-nine-eleven-2001",
    title: "9/11 Attacks and the Global War on Terror",
    year: 2001,
    category: "WAR",
    region: "North America",
    overview: "On September 11, 2001, al-Qaeda operatives hijacked four commercial airliners and carried out coordinated suicide attacks against the United States. Two planes struck the World Trade Center in New York, one hit the Pentagon, and one crashed in Pennsylvania after passengers fought back. Nearly 3,000 people were killed in the deadliest terrorist attack in history. The attacks fundamentally reshaped U.S. foreign policy, leading to wars in Afghanistan and Iraq, and the creation of a global counterterrorism architecture.",
    causes: "Al-Qaeda, led by Osama bin Laden, targeted the United States over its military presence in Saudi Arabia, its support for Israel, and broader grievances against Western influence in Muslim countries. The operatives trained in Afghanistan under Taliban protection and exploited gaps in U.S. aviation security.",
    outcome: "The U.S. launched the invasion of Afghanistan in October 2001 to topple the Taliban and destroy al-Qaeda. The Iraq War followed in 2003 on contested intelligence about weapons of mass destruction. The 'War on Terror' defined U.S. foreign policy for two decades, created the Department of Homeland Security, and profoundly impacted civil liberties, surveillance, and international law.",
    participants: [
      { countryId: 1, countryName: "United States", isoCode: "USA", role: "PRIMARY", description: "Suffered the deadliest terrorist attack in history; launched the Global War on Terror in response" },
      { countryId: 4, countryName: "Pakistan", isoCode: "PAK", role: "SECONDARY", description: "Became a frontline state in the War on Terror; provided logistical support while harboring conflicting interests" },
    ],
    timeline: [
      { date: "2001-09-11", title: "Attacks on U.S. soil", description: "Four hijacked planes struck the World Trade Center, Pentagon, and a field in Pennsylvania, killing nearly 3,000 people." },
      { date: "2001-10-07", title: "U.S. invades Afghanistan", description: "Operation Enduring Freedom launched to overthrow the Taliban and destroy al-Qaeda training camps." },
      { date: "2001-12-17", title: "Taliban regime falls", description: "Taliban forces abandoned Kandahar, their last major stronghold. The regime collapsed within months." },
      { date: "2003-03-20", title: "Iraq War begins", description: "The U.S. invaded Iraq, broadening the War on Terror based on contested WMD intelligence." },
      { date: "2011-05-02", title: "Bin Laden killed", description: "U.S. Navy SEALs killed Osama bin Laden in Abbottabad, Pakistan, in a covert raid." },
    ],
    linkedConflictIds: [],
    linkedEventIds: ["pakistan-nuclear-tests-1998"],
    references: [
      { title: "9/11 Commission Report", source: "National Commission on Terrorist Attacks", url: "https://www.9-11commission.gov/report/" },
      { title: "U.S. War in Afghanistan", source: "Council on Foreign Relations", url: "https://www.cfr.org/timeline/us-war-afghanistan" },
    ],
    significance: "DEFINING",
  },
];

export function getEventById(id: string): HistoricalEvent | undefined {
  return historicalEvents.find((event) => event.id === id);
}

export function getEventsByCountry(isoCode: string): HistoricalEvent[] {
  return historicalEvents.filter((event) =>
    event.participants.some((p) => p.isoCode === isoCode)
  );
}

export function getEventsByConflict(conflictId: number): HistoricalEvent[] {
  return historicalEvents.filter((event) =>
    event.linkedConflictIds.includes(conflictId)
  );
}

export const dashboards: Record<string, CountryDashboard> = {
  USA: {
    country: countries[0],
    profile: countryProfiles.USA,
    activeConflicts: conflicts.filter((conflict) => conflict.participants.some((p) => p.isoCode === "USA")),
    historicalConflicts: [],
    recentNews: newsArticles.filter((article) => article.relatedCountries.includes("USA")),
    strategicWatch: newsArticles.filter((article) => article.relatedCountries.includes("USA") && /iran|gulf|proxy|tehran/i.test(`${article.title} ${article.content}`)),
    videos: [],
    relations: countryRelations.USA,
    economy: {
      gdpUsd: 27900000000000,
      totalEconomicLoss: 18600000000,
      activeConflicts: 3,
      trend: "STABLE",
    },
    historicalMilestones: historicalMilestones.USA,
  },
  IRN: {
    country: countries[1],
    profile: countryProfiles.IRN,
    activeConflicts: conflicts.filter((conflict) => conflict.participants.some((p) => p.isoCode === "IRN")),
    historicalConflicts: [],
    recentNews: newsArticles.filter((article) => article.relatedCountries.includes("IRN")),
    strategicWatch: newsArticles.filter((article) => article.relatedCountries.includes("IRN") && /iran|gulf|proxy|tehran|nuclear/i.test(`${article.title} ${article.content}`)),
    videos: [],
    relations: countryRelations.IRN,
    economy: {
      gdpUsd: 404000000000,
      totalEconomicLoss: 5100000000,
      activeConflicts: 1,
      trend: "DECLINING",
    },
    historicalMilestones: historicalMilestones.IRN,
  },
  PAK: {
    country: countries[3],
    profile: countryProfiles.PAK,
    activeConflicts: [],
    historicalConflicts: [],
    recentNews: newsArticles.filter((article) => article.relatedCountries.includes("PAK")),
    strategicWatch: newsArticles.filter((article) => article.relatedCountries.includes("PAK") && /iran|gulf|proxy|tehran|nuclear/i.test(`${article.title} ${article.content}`)),
    videos: [],
    relations: countryRelations.PAK,
    economy: {
      gdpUsd: 338000000000,
      totalEconomicLoss: 900000000,
      activeConflicts: 0,
      trend: "STABLE",
    },
    historicalMilestones: historicalMilestones.PAK,
  },
  ISR: {
    country: countries[2],
    profile: countryProfiles.ISR,
    activeConflicts: conflicts.filter((conflict) => conflict.participants.some((p) => p.isoCode === "ISR")),
    historicalConflicts: [],
    recentNews: newsArticles.filter((article) => article.relatedCountries.includes("ISR")),
    strategicWatch: newsArticles.filter((article) => article.relatedCountries.includes("ISR") && /iran|gulf|proxy|tehran/i.test(`${article.title} ${article.content}`)),
    videos: [],
    relations: [],
    economy: {
      gdpUsd: 548000000000,
      totalEconomicLoss: 7600000000,
      activeConflicts: 1,
      trend: "DECLINING",
    },
    historicalMilestones: historicalMilestones.ISR,
  },
};

export const warRoomData: WarRoom = {
  activeConflicts: conflicts.filter((conflict) => conflict.status === "ACTIVE"),
  recentEvents: Object.values(conflictEvents).flat().sort((a, b) => b.eventDate.localeCompare(a.eventDate)),
  breakingNews: newsArticles.slice(0, 3),
  alerts,
  globalStats: {
    totalActiveConflicts: conflicts.filter((conflict) => conflict.status === "ACTIVE").length,
    totalCountriesAffected: 7,
    totalCasualties: conflicts.reduce((sum, conflict) => sum + conflict.totalCasualties, 0),
    criticalAlerts: alerts.filter((alert) => alert.severity === "CRITICAL").length,
  },
};

export function getConflictById(id: string) {
  return conflicts.find((conflict) => conflict.id === Number(id));
}

export function getCountryByIso(isoCode: string) {
  return dashboards[isoCode.toUpperCase()];
}

export function getConflictEvents(id: string) {
  return conflictEvents[Number(id)] ?? [];
}

export function getConflictStats(id: string) {
  return conflictStats[Number(id)] ?? [];
}

// Everything personal on the home page lives here. Edit freely.

export const profile = {
  name: "alden luthfi",
  alias: "upi",
  handle: "aldenluthfi",
  roles: ["humanitarian activist", "software developer", "teaching assistant", "graphic designer", "cinephile"],
  current: { label: "sdet intern", at: "tiket.com" },
  location: "jakarta, indonesia",
  study: "cs @ universitas indonesia",
  email: "hi@aldenluth.fi",
  stack: [
    "c", "c++", "rust", "python", "java", "typescript", "react", "flutter",
    "docker", "elasticsearch", "mysql", "postgresql", "neovim", "figma", "after effects",
  ],
  socials: [
    { label: "github", href: "https://github.com/aldenluthfi" },
    { label: "linkedin", href: "https://linkedin.com/in/aldenluthfi" },
    { label: "instagram", href: "https://instagram.com/aldenluthfi" },
    { label: "x", href: "https://twitter.com/gesperkebalik" },
  ],
}

/** Shown in the tl;dr card. Leave a field null to hide its row. */
export const tldr: { learning: string | null; reading: string | null } = {
  learning: null,
  reading: null,
}

export type Experience = {
  role: string
  org: string
  period: string
  summary: string
}

export const experience: Experience[] = [
  {
    role: "sdet intern",
    org: "tiket.com",
    period: "jul 2025 — now",
    summary: "builds and maintains automated test frameworks for the ios and android apps with appium and java, running cross-device suites on lambdatest.",
  },
  {
    role: "coordinator teaching assistant",
    org: "intro to computer organization, fasilkom ui",
    period: "jan 2025 — now",
    summary: "leads 15 teaching assistants and revises all course material on cpu architecture and mips / avr assembly.",
  },
  {
    role: "deputy coordinator of socio-politics",
    org: "bem fasilkom ui",
    period: "jun 2025 — now",
    summary: "coordinates the faculty's socio-political initiatives and partnerships with outside organizations.",
  },
  {
    role: "network, security & os lead",
    org: "ristek fasilkom ui",
    period: "mar 2024 — feb 2025",
    summary: "gemastik 2024 finalist, won several local capture the flag competitions, and pulled others into cybersecurity.",
  },
  {
    role: "coordinator teaching assistant",
    org: "platform based programming, fasilkom ui",
    period: "aug 2024 — dec 2024",
    summary: "led 25 teaching assistants for the course that teaches django and flutter for web and mobile development.",
  },
  {
    role: "volunteer",
    org: "savana by bakti bca",
    period: "jun 2025",
    summary: "a month of community service in wonokitri, pasuruan: taught english at sdn 2 wonokitri and set up a disaster early-warning system.",
  },
]

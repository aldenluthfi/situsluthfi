// Everything personal on the home page lives here. Edit freely.

export const profile = {
  name: "Alden Luthfi",
  alias: "Upi",
  tagline: "creative designer and developer",
  handle: "aldenluthfi",
  roles: "activist, developer, designer, educator, and most importantly, **lifelong-learner**",
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

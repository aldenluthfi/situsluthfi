export type WritingObject = {
  id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  lastUpdated: Date;
}

export type WritingContentObject = {
  content: string;
  lastSynced: Date;
}

export type ThemeString = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "neutral";
export type ModeString = "light" | "dark" | "system";
export type Racer = {
  id: string;
  name: string;
  color: string;
};

export const RACERS: Racer[] = [
  { id: "mario", name: "Mario", color: "#E52521" },
  { id: "luigi", name: "Luigi", color: "#00AA00" },
  { id: "peach", name: "Peach", color: "#FF9ECF" },
  { id: "yoshi", name: "Yoshi", color: "#7CFC00" },
  { id: "bowser", name: "Bowser", color: "#2E7D32" },
  { id: "toad", name: "Toad", color: "#1E88E5" },
  { id: "toadette", name: "Toadette", color: "#EC407A" },
  { id: "koopa-troopa", name: "Koopa Troopa", color: "#43A047" },
  { id: "wario", name: "Wario", color: "#FDD835" },
  { id: "waluigi", name: "Waluigi", color: "#7B1FA2" },
  { id: "baby-mario", name: "Baby Mario", color: "#EF5350" },
  { id: "baby-luigi", name: "Baby Luigi", color: "#66BB6A" },
  { id: "baby-peach", name: "Baby Peach", color: "#F48FB1" },
  { id: "baby-daisy", name: "Baby Daisy", color: "#FFA726" },
  { id: "baby-rosalina", name: "Baby Rosalina", color: "#4FC3F7" },
  { id: "pauline", name: "Pauline", color: "#C62828" },
  { id: "shy-guy", name: "Shy Guy", color: "#D32F2F" },
  { id: "donkey-kong", name: "Donkey Kong", color: "#8D6E63" },
  { id: "daisy", name: "Daisy", color: "#FF9800" },
  { id: "rosalina", name: "Rosalina", color: "#29B6F6" },
  { id: "lakitu", name: "Lakitu", color: "#FFF176" },
  { id: "birdo", name: "Birdo", color: "#F06292" },
  { id: "king-boo", name: "King Boo", color: "#F5F5F5" },
  { id: "bowser-jr", name: "Bowser Jr.", color: "#66BB6A" },
  { id: "goomba", name: "Goomba", color: "#8D6E63" },
  { id: "wiggler", name: "Wiggler", color: "#FFEB3B" },
  { id: "dry-bones", name: "Dry Bones", color: "#ECEFF1" },
  { id: "hammer-bro", name: "Hammer Bro", color: "#43A047" },
  { id: "nabbit", name: "Nabbit", color: "#7E57C2" },
  { id: "piranha-plant", name: "Piranha Plant", color: "#E53935" },
  { id: "sidestepper", name: "Sidestepper", color: "#EF5350" },
  { id: "monty-mole", name: "Monty Mole", color: "#6D4C41" },
  { id: "stingby", name: "Stingby", color: "#FFEB3B" },
  { id: "penguin", name: "Penguin", color: "#37474F" },
  { id: "cheep-cheep", name: "Cheep Cheep", color: "#EF5350" },
  { id: "cow", name: "Cow", color: "#FAFAFA" },
  { id: "para-biddybud", name: "Para-Biddybud", color: "#EC407A" },
  { id: "pokey", name: "Pokey", color: "#FFB74D" },
  { id: "snowman", name: "Snowman", color: "#E3F2FD" },
  { id: "spike", name: "Spike", color: "#66BB6A" },
  { id: "cataquack", name: "Cataquack", color: "#FF7043" },
  { id: "pianta", name: "Pianta", color: "#29B6F6" },
  { id: "rocky-wrench", name: "Rocky Wrench", color: "#78909C" },
  { id: "conkdor", name: "Conkdor", color: "#FFA726" },
  { id: "peepa", name: "Peepa", color: "#F5F5F5" },
  { id: "swoop", name: "Swoop", color: "#5D4037" },
  { id: "fish-bone", name: "Fish Bone", color: "#ECEFF1" },
  { id: "coin-coffer", name: "Coin Coffer", color: "#FFD54F" },
  { id: "dolphin", name: "Dolphin", color: "#4FC3F7" },
  { id: "chargin-chuck", name: "Chargin' Chuck", color: "#EF6C00" },
];

export const KAMEK_RACER_IDS = [
  "cataquack",
  "chargin-chuck",
  "coin-coffer",
  "conkdor",
  "dolphin",
  "fish-bone",
  "peepa",
  "pianta",
  "rocky-wrench",
  "spike",
  "swoop",
] as const;

const KAMEK_ID_SET = new Set<string>(KAMEK_RACER_IDS);

export function isKamekRacer(id: string): boolean {
  return KAMEK_ID_SET.has(id);
}

export const RACER_BY_ID: Record<string, Racer> = Object.fromEntries(
  RACERS.map((racer) => [racer.id, racer]),
);

export function getRacer(id: string): Racer {
  const racer = RACER_BY_ID[id];
  if (!racer) throw new Error(`Unknown racer: ${id}`);
  return racer;
}

export function racerEmblem(id: string): string {
  return `/emblems/${id}.png`;
}

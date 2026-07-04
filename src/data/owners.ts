/**
 * Team owners, keyed by team id. Each owner has a full designed poster card in
 * /public/owners/<teamId>.jpg — shown in the opening ceremony right after the
 * team's logo reveal.
 */
export interface TeamOwner {
  name: string;
  card: string;
}

export const ownerByTeam: Record<string, TeamOwner> = {
  "soorangal-super-kings": { name: "Nusban", card: "/owners/soorangal-super-kings.jpg" },
  "elilarangu-eagles": { name: "Sanoos", card: "/owners/elilarangu-eagles.jpg" },
  "kuttikarachi-lions": { name: "Hanan", card: "/owners/kuttikarachi-lions.jpg" },
  "faizal-nagar-force": { name: "Arafath", card: "/owners/faizal-nagar-force.jpg" },
  "mahroof-nagar-riders": { name: "Imran", card: "/owners/mahroof-nagar-riders.jpg" },
  "buhariyadi-blasters": { name: "Niyas", card: "/owners/buhariyadi-blasters.jpg" },
  "mancholai-strikers": { name: "Riyas", card: "/owners/mancholai-strikers.jpg" },
  "kurinchakeny-warriors": { name: "Imras", card: "/owners/kurinchakeny-warriors.jpg" },
};

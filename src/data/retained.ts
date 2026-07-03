/**
 * Players each franchise retained ahead of the 2026 mega auction. Keyed by the
 * team `id` from `@/data/teams`. Card art lives in /public/retained.
 */
export interface RetainedPlayer {
  name: string;
  role: string;
  /** Full "RETAINED" promo card under /public/retained. */
  card: string;
}

export const retainedByTeam: Record<string, RetainedPlayer[]> = {
  "soorangal-super-kings": [
    { name: "Asras", role: "Batting All Rounder", card: "/retained/asras.jpg" },
    { name: "Wajoor", role: "Bowling All Rounder", card: "/retained/wajoor.jpg" },
  ],
  "elilarangu-eagles": [
    { name: "Jezuki", role: "Batting All Rounder", card: "/retained/jezuki.jpg" },
    { name: "Dilshan", role: "Batting All Rounder", card: "/retained/dilshan.jpg" },
  ],
  "kuttikarachi-lions": [
    { name: "Askar", role: "Batting All Rounder", card: "/retained/askar.jpg" },
    { name: "Safnas", role: "Batting All Rounder", card: "/retained/safnas.jpg" },
  ],
  "faizal-nagar-force": [
    { name: "Siyath", role: "Batting All Rounder", card: "/retained/siyath.jpg" },
    { name: "Thajmeer", role: "Batting All Rounder", card: "/retained/thajmeer.jpg" },
  ],
  "mahroof-nagar-riders": [
    { name: "Fais", role: "Batting All Rounder", card: "/retained/fais.jpg" },
    { name: "Adnan", role: "Batting All Rounder", card: "/retained/adnan.jpg" },
  ],
  "buhariyadi-blasters": [
    { name: "Shazran", role: "Batting All Rounder", card: "/retained/shazran.jpg" },
    { name: "Arafath", role: "Batting All Rounder", card: "/retained/arafath.jpg" },
  ],
  "mancholai-strikers": [
    { name: "Azeem", role: "Batting All Rounder", card: "/retained/azeem.jpg" },
    { name: "Kiros", role: "Bowling All Rounder", card: "/retained/kiros.jpg" },
  ],
  "kurinchakeny-warriors": [
    { name: "Ripsan", role: "Batting All Rounder", card: "/retained/ripsan.jpg" },
    { name: "Dadad", role: "Batsman", card: "/retained/dadad.jpg" },
  ],
};

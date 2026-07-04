/**
 * KPL Committee — Media Team members. Each has a full designed poster card in
 * /public/media-team/<name>.jpg — shown as its own slide in the opening ceremony.
 */
export interface MediaMember {
  name: string;
  card: string;
}

export const mediaTeam: MediaMember[] = [
  { name: "Mahfoos", card: "/media-team/mahfoos.jpg" },
  { name: "Saheer", card: "/media-team/saheer.jpg" },
  { name: "Rifnas", card: "/media-team/rifnas.jpg" },
];

/**
 * KPL 2026 Organising Committee. Each member has a full designed poster card in
 * /public/committee/<name>.jpg — shown in the opening ceremony, three per slide.
 * Ordered by seniority.
 */
export interface CommitteeMember {
  name: string;
  role: string;
  card: string;
}

export const committee: CommitteeMember[] = [
  { name: "Kalifathulla", role: "President", card: "/committee/kalifathulla.jpg" },
  { name: "ALM. Nawfees", role: "Vice President", card: "/committee/nawfees.jpg" },
  { name: "RM. Amjath", role: "Vice President", card: "/committee/amjath.jpg" },
  { name: "M. Sajahan", role: "Advisor", card: "/committee/sajahan.jpg" },
  { name: "MRM. Rassan", role: "Secretary", card: "/committee/rassan.jpg" },
  { name: "MI. Musni Mohammed", role: "Treasurer", card: "/committee/musni-mohammed.jpg" },
  { name: "FM. Farees", role: "Coordinator", card: "/committee/farees.jpg" },
  { name: "AGA. Faseer", role: "Coordinator", card: "/committee/faseer.jpg" },
  { name: "ARA. Kirosh", role: "Member", card: "/committee/kirosh.jpg" },
  { name: "MAM. Rafees", role: "Member", card: "/committee/rafees.jpg" },
  { name: "RFM. Nafeer", role: "Member", card: "/committee/nafeer.jpg" },
  { name: "VM. Furkhan", role: "Member", card: "/committee/furkhan.jpg" },
  { name: "FM. Hizam", role: "Member", card: "/committee/hizam.jpg" },
  { name: "M. Sajari", role: "Member", card: "/committee/sajari.jpg" },
];

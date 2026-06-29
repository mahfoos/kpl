import type { Stat } from "@/types";

export const stats: Stat[] = [
  {
    id: "s1",
    value: 208,
    label: "Registered Players",
    caption: "Ready for the auction pool",
    icon: "Users",
  },
  {
    id: "s2",
    value: 8,
    label: "Franchises",
    caption: "Battling for glory",
    icon: "Shield",
  },
  {
    id: "s3",
    value: 0,
    label: "Mega Auction",
    caption: "Coming Soon",
    icon: "Gavel",
    comingSoon: true,
  },
  {
    id: "s4",
    value: 1,
    label: "Champion",
    caption: "One dream, one crown",
    icon: "Trophy",
  },
];

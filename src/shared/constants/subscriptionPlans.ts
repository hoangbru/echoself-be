export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    currency: "USD",
    features: [
      "Ad-supported streaming",
      "Standard audio quality",
      "Shuffle play",
    ],
    limits: {
      skipTracks: 6,
      audioQuality: "MEDIUM",
    },
  },
  PREMIUM: {
    name: "Premium",
    price: 9.99,
    currency: "USD",
    features: [
      "Ad-free streaming",
      "High audio quality",
      "Unlimited skips",
      "Offline downloads",
      "On-demand playback",
    ],
    limits: {
      skipTracks: -1, // unlimited
      audioQuality: "HIGH",
    },
  },
  FAMILY: {
    name: "Family",
    price: 14.99,
    currency: "USD",
    features: [
      "All Premium features",
      "Up to 6 accounts",
      "Kid-friendly content",
      "Family mix playlist",
    ],
    limits: {
      skipTracks: -1,
      audioQuality: "HIGH",
      maxMembers: 6,
    },
  },
  STUDENT: {
    name: "Student",
    price: 4.99,
    currency: "USD",
    features: [
      "All Premium features",
      "Student discount",
      "Verification required",
    ],
    limits: {
      skipTracks: -1,
      audioQuality: "HIGH",
    },
  },
} as const;

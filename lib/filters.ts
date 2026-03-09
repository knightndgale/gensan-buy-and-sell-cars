/**
 * Predefined brackets for car filter dropdowns.
 */

export const PRICE_BRACKETS = [
  0, 100_000, 200_000, 300_000, 400_000, 500_000, 600_000, 700_000, 800_000, 900_000,
  1_000_000, 1_250_000, 1_500_000, 1_750_000, 2_000_000, 2_500_000, 3_000_000,
  4_000_000, 5_000_000, 7_500_000, 10_000_000,
] as const;

export const MILEAGE_BRACKETS = [
  0, 10_000, 20_000, 30_000, 50_000, 75_000, 100_000, 150_000, 200_000, 300_000, 500_000,
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "cvt", label: "CVT" },
  { value: "dct", label: "DCT" },
] as const;

export const BODY_TYPE_OPTIONS = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Pickup",
  "MPV",
  "Van",
  "Coupe",
  "Wagon",
  "Other",
] as const;

export const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

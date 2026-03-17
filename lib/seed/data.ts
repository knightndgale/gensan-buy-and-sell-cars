/**
 * Seed data for dev environment.
 * Collections: carMakes, carModels, carFeatures, dealers, listings, listingImages
 */

export const CAR_MAKES = [
  { id: 1, name: "Toyota" },
  { id: 2, name: "Honda" },
  { id: 3, name: "Mitsubishi" },
  { id: 4, name: "Nissan" },
  { id: 5, name: "Isuzu" },
  { id: 6, name: "Ford" },
  { id: 7, name: "Hyundai" },
  { id: 8, name: "Suzuki" },
  { id: 9, name: "Kia" },
  { id: 10, name: "Mazda" },
] as const;

export const CAR_MODELS = [
  { id: 1, makeId: 1, name: "Vios" },
  { id: 2, makeId: 1, name: "Camry" },
  { id: 3, makeId: 1, name: "Innova" },
  { id: 4, makeId: 1, name: "Fortuner" },
  { id: 5, makeId: 1, name: "Hilux" },
  { id: 6, makeId: 2, name: "Civic" },
  { id: 7, makeId: 2, name: "City" },
  { id: 8, makeId: 2, name: "BR-V" },
  { id: 9, makeId: 2, name: "CR-V" },
  { id: 10, makeId: 3, name: "Mirage" },
  { id: 11, makeId: 3, name: "Lancer" },
  { id: 12, makeId: 3, name: "Montero Sport" },
  { id: 13, makeId: 3, name: "Xpander" },
  { id: 14, makeId: 4, name: "Navara" },
  { id: 15, makeId: 4, name: "Terra" },
  { id: 16, makeId: 4, name: "Almera" },
  { id: 17, makeId: 5, name: "D-Max" },
  { id: 18, makeId: 5, name: "mu-X" },
  { id: 19, makeId: 6, name: "Ranger" },
  { id: 20, makeId: 6, name: "Everest" },
  { id: 21, makeId: 7, name: "Accent" },
  { id: 22, makeId: 7, name: "Tucson" },
  { id: 23, makeId: 8, name: "Ertiga" },
  { id: 24, makeId: 8, name: "Swift" },
  { id: 25, makeId: 9, name: "Picanto" },
  { id: 26, makeId: 9, name: "Seltos" },
  { id: 27, makeId: 10, name: "Mazda3" },
  { id: 28, makeId: 10, name: "CX-5" },
] as const;

export const SEED_FEATURES = [
  "Touchscreen Infotainment",
  "Backup Camera",
  "Keyless Entry",
  "ABS Brakes",
  "Power Windows",
  "Apple CarPlay",
  "Android Auto",
  "LED Headlamps",
  "Parking Sensors",
  "Bluetooth Audio",
  "USB Port",
  "Cruise Control",
  "Push Start",
  "Leather Seats",
  "Sunroof",
  "Navigation System",
  "Airbags",
] as const;

export const SEED_USERS = [
  { email: "seller1@dev.local", password: "dev-seller-123", displayName: "Demo Seller 1" },
  { email: "seller2@dev.local", password: "dev-seller-123", displayName: "Demo Seller 2" },
] as const;

export const SEED_ADMIN_USERS = [
  { email: "admin@dev.local", password: "dev-admin-123", displayName: "Demo Admin" },
] as const;

import { z } from "zod";

// Enums
export const UserRoleSchema = z.enum(["customer", "seller", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const ListingStatusSchema = z.enum(["active", "sold", "archived", "pending"]);
export type ListingStatus = z.infer<typeof ListingStatusSchema>;

export const TransmissionSchema = z.enum(["manual", "automatic", "cvt", "dct"]);
export type Transmission = z.infer<typeof TransmissionSchema>;

export const FuelTypeSchema = z.enum(["gasoline", "diesel", "hybrid", "electric"]);
export type FuelType = z.infer<typeof FuelTypeSchema>;

// User
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  isVerified: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

// Dealer (with GHL fields)
export const DealerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  dealershipName: z.string(),
  location: z.string(),
  ghlLocationId: z.string().optional(),
  ghlFormEmbedUrl: z.string().url().optional(),
  phone: z.string().optional(),
  viberUrl: z.string().optional(),
  whatsappUrl: z.string().optional(),
  messengerUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Dealer = z.infer<typeof DealerSchema>;

// Car Make
export const CarMakeSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type CarMake = z.infer<typeof CarMakeSchema>;

// Car Model
export const CarModelSchema = z.object({
  id: z.number(),
  makeId: z.number(),
  name: z.string(),
});
export type CarModel = z.infer<typeof CarModelSchema>;

// Listing
export const ListingSchema = z.object({
  id: z.string(),
  dealerId: z.string(),
  modelId: z.number(),
  year: z.number().min(1900).max(2100),
  price: z.number().min(0),
  mileage: z.number().min(0),
  transmission: TransmissionSchema,
  fuelType: FuelTypeSchema,
  location: z.string(),
  description: z.string(),
  status: ListingStatusSchema,
  isFeatured: z.boolean().optional(),
  title: z.string().optional(),
  bodyType: z.string().optional(),
  engine: z.string().optional(),
  color: z.string().optional(),
  features: z.array(z.string()).optional(),
  views: z.number().min(0).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  soldAt: z.string().nullable().optional(),
});
export type Listing = z.infer<typeof ListingSchema>;

// Listing record as read from Firestore.
// Some legacy/incomplete documents may be missing fields that are required on create/update.
export const ListingRecordSchema = ListingSchema.partial({
  dealerId: true,
  modelId: true,
  year: true,
  price: true,
  mileage: true,
  transmission: true,
  fuelType: true,
  location: true,
  description: true,
  status: true,
});
export type ListingRecord = z.infer<typeof ListingRecordSchema>;

// Listing Image
export const ListingImageSchema = z.object({
  id: z.string().optional(),
  listingId: z.string(),
  imageUrl: z.string().url(),
  isPrimary: z.boolean().optional(),
});
export type ListingImage = z.infer<typeof ListingImageSchema>;

// Input schemas (omit id, createdAt, etc.)
export const DealerInputSchema = DealerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type DealerInput = z.infer<typeof DealerInputSchema>;

export const ListingInputSchema = ListingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type ListingInput = z.infer<typeof ListingInputSchema>;

export const ListingFormInputSchema = ListingInputSchema.omit({ dealerId: true })
  .extend({
    dealerId: z.string().optional(),
    price: z.number().min(1, "Price is required"),
    mileage: z.number().min(1, "Mileage is required"),
    location: z.string().min(1, "Location is required"),
    bodyType: z.string().min(1, "Body type is required"),
  })
  .refine((d) => d.modelId > 0, { message: "Please select a model", path: ["modelId"] });
export type ListingFormInput = z.infer<typeof ListingFormInputSchema>;

export const ListingImageInputSchema = ListingImageSchema.omit({ id: true });
export type ListingImageInput = z.infer<typeof ListingImageInputSchema>;

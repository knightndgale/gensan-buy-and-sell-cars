import { ListingForm } from "@/components/seller/ListingForm";

export default function NewListingPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Add New Listing</h1>
      <ListingForm />
    </div>
  );
}

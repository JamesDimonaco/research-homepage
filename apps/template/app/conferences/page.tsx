import { sanityFetch } from "@/sanity/lib/client";
import { ConferenceCard } from "@research-homepage/components";
import type { Conference } from "@research-homepage/cms";

export default async function ConferencesPage() {
  const conferences = await sanityFetch<Conference[]>({
    query: `*[_type == "conference"] | order(featured desc, date desc)`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Talks & Conferences</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conferences?.map((conference) => (
          <ConferenceCard key={conference._id} conference={conference} />
        ))}
      </div>

      {(!conferences || conferences.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No conferences yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}

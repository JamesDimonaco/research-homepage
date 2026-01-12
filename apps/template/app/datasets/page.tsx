import { sanityFetch } from "@/sanity/lib/client";
import { DatasetCard } from "@research-homepage/components";
import type { Dataset } from "@research-homepage/cms";

export default async function DatasetsPage() {
  const datasets = await sanityFetch<Dataset[]>({
    query: `*[_type == "dataset"] | order(featured desc, releaseDate desc)`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Datasets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets?.map((dataset) => (
          <DatasetCard key={dataset._id} dataset={dataset} />
        ))}
      </div>

      {(!datasets || datasets.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No datasets yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}

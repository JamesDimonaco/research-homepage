import { sanityFetch } from "@/sanity/lib/client";
import { Dataset } from "../types/sanity";
import DatasetCard from "../components/DatasetCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const datasetsQuery = `*[_type == "dataset"] | order(coalesce(order, 0), featured desc, releaseDate desc) {
  ...,
  "relatedProject": relatedProject->{title, slug},
  "relatedPublication": relatedPublication->{title, googleScholarLink}
}`;

export default async function DatasetsPage() {
  const datasets = await sanityFetch<Dataset[]>({ query: datasetsQuery });

  const dataTypes = Array.from(new Set(datasets.map(d => d.dataType)));
  const licenses = Array.from(new Set(datasets.map(d => d.license)));
  const accessTypes = Array.from(new Set(datasets.map(d => d.accessType)));

  const featuredDatasets = datasets.filter(d => d.featured);
  const openDatasets = datasets.filter(d => d.accessType === "open");

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Research Data & Datasets</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Open datasets, code repositories, and research data for reproducible science.
        </p>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No datasets found. Add some in Sanity Studio!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="search"
              placeholder="Search datasets..."
              className="md:max-w-sm"
              disabled
            />
            <Select disabled>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="Data Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dataTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="License" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Licenses</SelectItem>
                {licenses.map(license => (
                  <SelectItem key={license} value={license}>
                    {license}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="Access Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access Types</SelectItem>
                {accessTypes.map(access => (
                  <SelectItem key={access} value={access}>
                    {access.charAt(0).toUpperCase() + access.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground -mt-8">
            Search and filtering coming soon. For now, browse all available datasets below.
          </p>

          {/* Featured Datasets */}
          {featuredDatasets.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">Featured Datasets</h2>
                <Badge variant="secondary">{featuredDatasets.length}</Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredDatasets.map((dataset) => (
                  <DatasetCard key={dataset._id} dataset={dataset} featured />
                ))}
              </div>
            </section>
          )}

          {/* Open Access Datasets */}
          {openDatasets.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">Open Access</h2>
                <Badge variant="default">{openDatasets.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openDatasets.map((dataset) => (
                  <DatasetCard key={dataset._id} dataset={dataset} />
                ))}
              </div>
            </section>
          )}

          {/* All Other Datasets */}
          {datasets.filter(d => !d.featured && d.accessType !== "open").length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">Other Datasets</h2>
                <Badge variant="outline">
                  {datasets.filter(d => !d.featured && d.accessType !== "open").length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets
                  .filter(d => !d.featured && d.accessType !== "open")
                  .map((dataset) => (
                    <DatasetCard key={dataset._id} dataset={dataset} />
                  ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
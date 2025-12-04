import { sanityFetch } from "@/sanity/lib/client";
import { Dataset } from "../../types/sanity";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Download, 
  Lock, 
  Unlock, 
  Database,
  FileText,
  ExternalLink,
  Package,
  Scale,
  UserCheck,
  ArrowLeft,
  Copy,
  Tag
} from "lucide-react";
import { PortableText } from "@portabletext/react";

const datasetQuery = `*[_type == "dataset" && slug.current == $slug][0] {
  ...,
  "relatedProject": relatedProject->{title, slug},
  "relatedPublication": relatedPublication->{title, googleScholarLink}
}`;

export async function generateStaticParams() {
  const datasets = await sanityFetch<Dataset[]>({
    query: `*[_type == "dataset"] { slug }`,
  });
  
  return datasets.map((dataset) => ({
    slug: dataset.slug.current,
  }));
}

export default async function DatasetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dataset = await sanityFetch<Dataset>({
    query: datasetQuery,
    params: { slug },
  });

  if (!dataset) {
    notFound();
  }

  const imageUrl = dataset.image ? urlForImage(dataset.image) : null;
  
  const dataTypeIcons = {
    tabular: "📊",
    images: "🖼️",
    text: "📝",
    audio: "🎵",
    video: "🎬",
    timeseries: "📈",
    geospatial: "🗺️",
    mixed: "🔀",
    code: "💻",
    other: "📦",
  };

  const accessIcons = {
    open: <Unlock className="w-5 h-5" />,
    registration: <UserCheck className="w-5 h-5" />,
    request: <FileText className="w-5 h-5" />,
    restricted: <Lock className="w-5 h-5" />,
  };

  const accessColors = {
    open: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    registration: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    request: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    restricted: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long",
      year: "numeric" 
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <Link href="/datasets">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Datasets
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={imageUrl}
              alt={dataset.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold">{dataset.title}</h1>
              {dataset.featured && (
                <Badge variant="secondary" className="text-sm">Featured Dataset</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <span className="mr-1">{dataTypeIcons[dataset.dataType]}</span>
                {dataset.dataType.charAt(0).toUpperCase() + dataset.dataType.slice(1)}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`text-sm ${accessColors[dataset.accessType]}`}
              >
                {accessIcons[dataset.accessType]}
                <span className="ml-1">
                  {dataset.accessType.charAt(0).toUpperCase() + dataset.accessType.slice(1)} Access
                </span>
              </Badge>
              
              {dataset.version && (
                <Badge variant="outline" className="text-sm">
                  Version {dataset.version}
                </Badge>
              )}
              
              {dataset.doi && (
                <Badge variant="outline" className="text-sm">
                  DOI: {dataset.doi}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{dataset.description}</p>

          {/* Key Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Dataset Information</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Released:</span>
                    <span>{formatDate(dataset.releaseDate)}</span>
                  </div>
                  
                  {dataset.size?.fileSize && (
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Size:</span>
                      <span>{dataset.size.fileSize}</span>
                    </div>
                  )}
                  
                  {dataset.size?.samples && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Samples:</span>
                      <span>{dataset.size.samples}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">License:</span>
                    <span>{dataset.license}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {accessIcons[dataset.accessType]}
                    <span className="text-muted-foreground">Access:</span>
                    <span>{dataset.accessType.charAt(0).toUpperCase() + dataset.accessType.slice(1)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {dataset.longDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Detailed Description</h2>
              <PortableText value={dataset.longDescription} />
            </div>
          )}

          {/* Download Options */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Access Dataset</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataset.accessType === "open" && dataset.downloadUrl && (
                <Link href={dataset.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Dataset
                  </Button>
                </Link>
              )}
              
              {dataset.accessType === "registration" && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Registration required to access this dataset
                  </p>
                  {dataset.repositoryUrl && (
                    <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                      <Button>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Register & Download
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              
              {dataset.accessType === "request" && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Please request access to this dataset
                  </p>
                  {dataset.repositoryUrl && (
                    <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                      <Button>
                        <FileText className="w-4 h-4 mr-2" />
                        Request Access
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              
              {dataset.accessType === "restricted" && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    This dataset has restricted access. Please contact the author for more information.
                  </p>
                </div>
              )}
              
              {dataset.repositoryUrl && (
                <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Repository
                  </Button>
                </Link>
              )}
              
              {dataset.paperUrl && (
                <Link href={dataset.paperUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Read Associated Paper
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Citation */}
          {dataset.citationText && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Citation</h2>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{dataset.citationText}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      navigator.clipboard.writeText(dataset.citationText || "");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Work */}
          {(dataset.relatedProject || dataset.relatedPublication) && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Related Work</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataset.relatedProject && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Project</p>
                    <Link 
                      href={`/projects/${dataset.relatedProject.slug.current}`}
                      className="text-primary hover:underline"
                    >
                      {dataset.relatedProject.title}
                    </Link>
                  </div>
                )}
                
                {dataset.relatedPublication && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Publication</p>
                    {dataset.relatedPublication.googleScholarLink ? (
                      <Link 
                        href={dataset.relatedPublication.googleScholarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {dataset.relatedPublication.title}
                        <ExternalLink className="w-3 h-3 ml-1 inline" />
                      </Link>
                    ) : (
                      <p>{dataset.relatedPublication.title}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {dataset.tags && dataset.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
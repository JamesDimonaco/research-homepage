import { CV } from "../types/sanity";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, FileIcon } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";

interface CVSectionProps {
  cvs: CV[];
}

export default function CVSection({ cvs }: CVSectionProps) {
  if (!cvs || cvs.length === 0) return null;

  const primaryCV = cvs.find(cv => cv.isPrimary) || cvs[0];
  const otherCVs = cvs.filter(cv => cv._id !== primaryCV._id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long",
      year: "numeric" 
    });
  };

  const getFileUrl = (file: CV['file']) => {
    // Construct the file URL from Sanity
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${file.asset._ref.replace('file-', '').replace('-', '.')}`;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          CV & Resume
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary CV - Featured */}
          <Card className="md:col-span-2 lg:col-span-1 border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {primaryCV.title}
                  </h3>
                  <Badge variant="default" className="text-xs">
                    Primary
                  </Badge>
                </div>
                <Badge variant="outline" className="text-xs">
                  {primaryCV.version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {primaryCV.description && (
                <p className="text-sm text-muted-foreground">
                  {primaryCV.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(primaryCV.lastUpdated)}</span>
                </div>
                {primaryCV.pages && (
                  <div className="flex items-center gap-1">
                    <FileIcon className="w-3 h-3" />
                    <span>{primaryCV.pages} pages</span>
                  </div>
                )}
                {primaryCV.fileSize && (
                  <span className="text-xs">{primaryCV.fileSize}</span>
                )}
              </div>
              
              <a 
                href={getFileUrl(primaryCV.file)}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download {primaryCV.title}
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Other CVs */}
          {otherCVs.map((cv) => (
            <Card key={cv._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {cv.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {cv.version}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {cv.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cv.description}
                  </p>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Updated {formatDate(cv.lastUpdated)}
                  {cv.pages && ` • ${cv.pages} pages`}
                </div>
                
                <a 
                  href={getFileUrl(cv.file)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {cvs.length === 1 && (
          <p className="text-sm text-muted-foreground text-center mt-6">
            Additional CV versions can be added through Sanity Studio
          </p>
        )}
      </div>
    </section>
  );
}
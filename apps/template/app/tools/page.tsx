import { sanityFetch } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import { Card, CardContent, CardHeader, Button } from "@research-homepage/ui";
import type { Tool } from "@research-homepage/cms";
import { Github, ExternalLink } from "lucide-react";

export default async function ToolsPage() {
  const tools = await sanityFetch<Tool[]>({
    query: `*[_type == "tool"]`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Tools & Software</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools?.map((tool) => (
          <Card key={tool._id} className="hover:shadow-lg transition-shadow">
            {tool.image && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={urlForImage(tool.image) || ""}
                  alt={tool.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <h2 className="text-xl font-semibold">{tool.name}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {tool.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tool.description}
                </p>
              )}
              {tool.githubLink && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={tool.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    {tool.linkButtonText || "View on GitHub"}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!tools || tools.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No tools yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}

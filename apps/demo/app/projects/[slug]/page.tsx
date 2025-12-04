import { sanityFetch } from "@/sanity/lib/client";
import { Project } from "../../types/sanity";
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
  Users, 
  DollarSign, 
  ExternalLink, 
  FileText,
  ArrowLeft,
  Building
} from "lucide-react";
import { PortableText } from "@portabletext/react";

const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
  ...,
  "publications": publications[]->{
    _id,
    title,
    publicationDate,
    googleScholarLink
  }
}`;

export async function generateStaticParams() {
  const projects = await sanityFetch<Project[]>({
    query: `*[_type == "project"] { slug }`,
  });
  
  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await sanityFetch<Project>({
    query: projectQuery,
    params: { slug },
  });

  if (!project) {
    notFound();
  }

  const imageUrl = project.image ? urlForImage(project.image) : null;
  
  const statusColors = {
    active: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    planning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    on_hold: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <Link href="/projects">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
              {project.featured && (
                <Badge variant="secondary" className="text-sm">Featured Project</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge 
                variant="outline" 
                className={statusColors[project.status]}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
              </Badge>
              
              {project.startDate && (
                <Badge variant="outline" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(project.startDate)}
                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{project.summary}</p>

          {project.funding && (project.funding.source || project.funding.amount) && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Funding Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.funding.source && (
                    <p><strong>Source:</strong> {project.funding.source}</p>
                  )}
                  {project.funding.amount && (
                    <p><strong>Amount:</strong> {project.funding.amount}</p>
                  )}
                  {project.funding.grantNumber && (
                    <p><strong>Grant Number:</strong> {project.funding.grantNumber}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {project.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <PortableText value={project.description} />
            </div>
          )}

          {project.collaborators && project.collaborators.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collaborators
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.collaborators.map((collaborator, index) => (
                    <div key={collaborator._key || index} className="space-y-1">
                      <p className="font-medium">
                        {collaborator.url ? (
                          <Link 
                            href={collaborator.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {collaborator.name}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </Link>
                        ) : (
                          collaborator.name
                        )}
                      </p>
                      {collaborator.role && (
                        <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                      )}
                      {collaborator.institution && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {collaborator.institution}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {project.publications && project.publications.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Related Publications
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.publications.map((pub) => (
                    <div key={pub._id} className="space-y-1">
                      <p className="font-medium">{pub.title}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {pub.publicationDate && (
                          <span>{new Date(pub.publicationDate).getFullYear()}</span>
                        )}
                        {pub.year && !pub.publicationDate && (
                          <span>{pub.year}</span>
                        )}
                        {pub.googleScholarLink && (
                          <Link 
                            href={pub.googleScholarLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            View on Google Scholar
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link, index) => (
                <Link 
                  key={link._key || index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {link.title}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {project.keywords && project.keywords.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {project.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
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
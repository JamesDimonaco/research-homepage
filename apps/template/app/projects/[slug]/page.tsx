import { sanityFetch } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Badge, Card, CardContent } from "@research-homepage/ui";
import type { Project } from "@research-homepage/cms";
import Link from "next/link";
import { ExternalLink, Calendar, Users } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "project" && defined(slug.current)]{ slug }`,
  });

  return projects?.map((project) => ({
    slug: project.slug.current,
  })) || [];
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await sanityFetch<Project>({
    query: `*[_type == "project" && slug.current == $slug][0]{
      ...,
      publications[]->
    }`,
    params: { slug },
  });

  if (!project) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    planning: "bg-yellow-500",
    on_hold: "bg-gray-500",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <article className="max-w-4xl mx-auto">
        {project.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlForImage(project.image) || ""}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            {project.status && (
              <Badge className={statusColors[project.status]}>
                {project.status.replace("_", " ")}
              </Badge>
            )}
          </div>

          {project.summary && (
            <p className="text-lg text-muted-foreground">{project.summary}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.startDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(project.startDate).toLocaleDateString()}
                  {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                </span>
              </div>
            )}
          </div>

          {project.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={project.description} />
            </div>
          )}

          {project.collaborators && project.collaborators.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collaborators
                </h2>
                <ul className="space-y-2">
                  {project.collaborators.map((collab, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="font-medium">{collab.name}</span>
                      {collab.role && <span className="text-muted-foreground">- {collab.role}</span>}
                      {collab.institution && (
                        <span className="text-sm text-muted-foreground">({collab.institution})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {link.title} <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

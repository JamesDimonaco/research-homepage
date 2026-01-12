import { sanityFetch } from "@/sanity/lib/client";
import { ProjectCard } from "@research-homepage/components";
import type { Project } from "@research-homepage/cms";

export default async function ProjectsPage() {
  const projects = await sanityFetch<Project[]>({
    query: `*[_type == "project"] | order(featured desc, order asc, startDate desc)`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Research Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No projects yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}

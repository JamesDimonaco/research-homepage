import { sanityFetch } from "@/sanity/lib/client";
import { Project } from "../types/sanity";
import ProjectCard from "../components/ProjectCard";
import { Badge } from "@/components/ui/badge";

const projectsQuery = `*[_type == "project"] | order(coalesce(order, 0), featured desc, startDate desc) {
  ...,
  "publications": publications[]->
}`;

export default async function ProjectsPage() {
  const projects = await sanityFetch<Project[]>({ query: projectsQuery });

  const activeProjects = projects.filter(p => p.status === "active");
  const completedProjects = projects.filter(p => p.status === "completed");
  const otherProjects = projects.filter(p => !["active", "completed"].includes(p.status));

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Research Projects</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Exploring innovative solutions through interdisciplinary research and collaboration.
        </p>
      </div>

      {activeProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Active Projects</h2>
            <Badge variant="default" className="text-sm">
              {activeProjects.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {completedProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Completed Projects</h2>
            <Badge variant="secondary" className="text-sm">
              {completedProjects.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Other Projects</h2>
            <Badge variant="outline" className="text-sm">
              {otherProjects.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No projects found. Add some in Sanity Studio!</p>
        </div>
      )}
    </div>
  );
}
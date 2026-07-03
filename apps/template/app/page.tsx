import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  Section,
  ContactSection,
  CVSection,
  ResearchInterestsCloud,
} from "@research-homepage/components";
import type {
  HomePage,
  ContactInfo,
  CV,
  ResearchInterest,
} from "@research-homepage/cms";

export default async function Home() {
  // Fetch all homepage data in parallel
  const [homePage, contactInfo, cvs, researchInterests] = await Promise.all([
    sanityFetch<HomePage>({
      query: `*[_type == "homePage"][0]`,
    }),
    sanityFetch<ContactInfo>({
      query: `*[_type == "contactInfo"][0]`,
    }),
    sanityFetch<CV[]>({
      query: `*[_type == "cv" && isPublic == true] | order(isPrimary desc, order asc, lastUpdated desc)`,
    }),
    sanityFetch<ResearchInterest[]>({
      query: `*[_type == "researchInterest" && active == true] | order(weight desc, order asc)`,
    }),
  ]);

  // Get Sanity project info for CV file URLs
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {homePage?.image && (
              <div className="shrink-0">
                <Image
                  src={urlForImage(homePage.image) || ""}
                  alt={homePage?.name || "Profile photo"}
                  width={300}
                  height={300}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            )}
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {homePage?.name || "Welcome"}
              </h1>
              {homePage?.bio && (
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                  {homePage.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections from CMS */}
      {homePage?.sections?.map((section, index) => (
        <Section key={index} {...section} />
      ))}

      {/* Research Interests Cloud */}
      {researchInterests && researchInterests.length > 0 && (
        <ResearchInterestsCloud interests={researchInterests} />
      )}

      {/* CV Section */}
      {cvs && cvs.length > 0 && (
        <CVSection cvs={cvs} projectId={projectId} dataset={dataset} />
      )}

      {/* Contact Section */}
      {contactInfo && <ContactSection contactInfo={contactInfo} />}
    </div>
  );
}

import Image from "next/image";
import { sanityFetch } from "../sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Section from "./components/Section";
import ContactSection from "./components/ContactSection";
import CVSection from "./components/CVSection";
import ResearchInterestsCloud from "./components/ResearchInterestsCloud";
import { HomePage, ContactInfo, CV, ResearchInterest } from "./types/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const query = `*[_type == "homePage"][0]`;
const contactQuery = `*[_type == "contactInfo"][0]`;
const cvQuery = `*[_type == "cv" && isPublic == true] | order(isPrimary desc, order asc, lastUpdated desc)`;
const interestsQuery = `*[_type == "researchInterest" && active == true] | order(weight desc, order asc)`;

export default async function Home() {
  const homePage = await sanityFetch<HomePage>({ query });
  const contactInfo = await sanityFetch<ContactInfo>({
    query: contactQuery,
  });
  const cvs = await sanityFetch<CV[]>({ query: cvQuery });
  const interests = await sanityFetch<ResearchInterest[]>({ query: interestsQuery });
  const image = homePage.image ? urlForImage(homePage.image) : null;

  const Sections = homePage.sections?.map((section, index) => (
    <div key={index}>
      <Section
        title={section.title}
        text={section.text}
        image={section.image}
        orientation={section.orientation}
        linkUrl={section.linkUrl}
        openInNewTab={section.openInNewTab}
      />
      {index < homePage.sections.length - 1 && (
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Separator className="my-0" />
        </div>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col overflow-x-hidden">
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {homePage.name}
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {homePage.bio}
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              {image ? (
                <div className="relative max-w-[400px] mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                  <Card className="relative border-0 shadow-2xl rounded-full overflow-hidden aspect-square">
                    <Image
                      src={image}
                      width={400}
                      height={400}
                      alt={homePage.name}
                      className="rounded-full w-full h-full object-cover"
                      priority
                    />
                  </Card>
                </div>
              ) : (
                <div className="max-w-[400px] mx-auto md:mx-0">
                  <Card className="aspect-square rounded-full flex items-center justify-center">
                    <CardContent>
                      <div className="text-center text-muted-foreground">
                        <svg
                          className="w-32 h-32 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <p>Profile Image</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {Sections}
      <ResearchInterestsCloud interests={interests} />
      <CVSection cvs={cvs} />
      <ContactSection contactInfo={contactInfo} />
    </div>
  );
}

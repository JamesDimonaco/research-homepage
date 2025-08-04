import Image from "next/image";
import { sanityFetch } from "../sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Section from "./components/Section";
import ContactSection from "./components/ContactSection";
import { HomePage, ContactInfo } from "./types/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const query = `*[_type == "homePage"][0]`;
const contactQuery = `*[_type == "contactInfo"][0]`;

export default async function Home() {
  const homePage = await sanityFetch<HomePage>({ query });
  const contactInfo = await sanityFetch<ContactInfo>({
    query: contactQuery,
  });
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
    <div className="flex flex-col">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">
                  Researcher • Educator • Innovator
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {homePage.name}
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {homePage.bio}
              </p>
              <div className="flex gap-4 pt-4">
                <Badge variant="outline">
                  <span className="mr-2">📚</span>
                  Academic Research
                </Badge>
                <Badge variant="outline">
                  <span className="mr-2">🔬</span>
                  Scientific Innovation
                </Badge>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              {image ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                  <Card className="relative border-0 shadow-2xl rounded-full overflow-hidden">
                    <Image
                      src={image}
                      width={400}
                      height={400}
                      alt={homePage.name}
                      className="rounded-full"
                      priority
                    />
                  </Card>
                </div>
              ) : (
                <Card className="w-[400px] h-[400px] rounded-full flex items-center justify-center">
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
              )}
            </div>
          </div>
        </div>
      </section>
      {Sections}
      <ContactSection contactInfo={contactInfo} />
    </div>
  );
}

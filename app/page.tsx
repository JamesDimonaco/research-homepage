import Image from "next/image";
import { sanityFetch } from "../sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Section from "./components/Section";
import ContactSection from "./components/ContactSection";
import { HomePage, ContactInfo } from "./types/sanity";

const query = `*[_type == "homePage"][0]`;
const contactQuery = `*[_type == "contactInfo"][0]`;

export default async function Home() {
  const homePage = await sanityFetch<HomePage>({ query });
  const { email, phone, linkedin, X } = await sanityFetch<ContactInfo>({
    query: contactQuery,
  });
  const image = homePage.image ? urlForImage(homePage.image) : null;

  const Sections = homePage.sections.map((section, index) => (
    <Section
      key={index}
      title={section.title}
      text={section.text}
      image={section.image}
      orientation={section.orientation}
    />
  ));

  return (
    <div className="flex flex-col">
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {homePage.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              {homePage.bio}
            </p>
          </div>
          <div className="flex justify-center">
            {image && (
              <Image
                src={image}
                width={300}
                height={300}
                alt="Profile Image"
                className="rounded-full"
              />
            )}
          </div>
        </div>
      </section>
      {Sections}
      <ContactSection
        email={email}
        phoneNumber={phone}
        linkedin={linkedin}
        x={X}
      />
    </div>
  );
}

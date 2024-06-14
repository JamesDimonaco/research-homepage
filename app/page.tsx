import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { sanityFetch } from "../sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Section, { type ISection } from "./components/Section";

const query = `*[_type == "homePage"][0]`;

export default async function Home() {
  const homePage = await sanityFetch<SanityDocument>({ query });
  const image = homePage.image ? urlForImage(homePage.image) : null;
  console.log(homePage.sections);

  const Sections = homePage.sections.map((section: ISection, index: number) => (
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
      <section className="bg-gray-100 dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              {homePage.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
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
    </div>
  );
}

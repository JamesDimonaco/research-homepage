import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Section as SectionType } from "../types/sanity";

interface SectionProps extends SectionType {
  key?: number;
}

const Section = ({ 
  title, 
  image, 
  text, 
  orientation, 
  linkUrl, 
  openInNewTab 
}: SectionProps) => {
  const imageUrl = image ? urlForImage(image) : null;
  const isExternal = linkUrl?.startsWith("http");
  const shouldOpenInNewTab = openInNewTab || isExternal;

  const sectionContent = (
    <>
      {orientation === "imageLeft" ? (
        <>
          <div className="relative overflow-hidden rounded-lg">
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={600}
                height={400}
                alt={title}
                className={`rounded-lg transition-transform duration-300 ${
                  linkUrl ? "group-hover:scale-105" : ""
                }`}
              />
            ) : (
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {linkUrl && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
            )}
          </div>
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold ${
              linkUrl ? "group-hover:text-primary-dark transition-colors duration-300" : ""
            }`}>
              {title}
              {linkUrl && (
                <span className="inline-block ml-2 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  →
                </span>
              )}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {text}
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold ${
              linkUrl ? "group-hover:text-primary-dark transition-colors duration-300" : ""
            }`}>
              {title}
              {linkUrl && (
                <span className="inline-block ml-2 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  →
                </span>
              )}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {text}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={600}
                height={400}
                alt={title}
                className={`rounded-lg transition-transform duration-300 ${
                  linkUrl ? "group-hover:scale-105" : ""
                }`}
              />
            ) : (
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {linkUrl && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
            )}
          </div>
        </>
      )}
    </>
  );

  if (linkUrl) {
    return (
      <section className="bg-card py-16">
        <Link
          href={linkUrl}
          target={shouldOpenInNewTab ? "_blank" : undefined}
          rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
          className="block"
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center group cursor-pointer">
            {sectionContent}
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {sectionContent}
      </div>
    </section>
  );
};

export default Section;
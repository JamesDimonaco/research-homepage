import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ExternalLink } from "lucide-react";
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

  const content = (
    <Card className={`border-0 shadow-none bg-transparent ${linkUrl ? 'group cursor-pointer' : ''}`}>
      <CardContent className="p-0">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
          orientation === "imageRight" ? "md:flex-row-reverse" : ""
        }`}>
          {/* Image Section */}
          <div className={orientation === "imageRight" ? "md:order-2" : ""}>
            <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    fill
                    alt={title}
                    className={`object-cover transition-all duration-500 ${
                      linkUrl ? "group-hover:scale-105 group-hover:brightness-110" : ""
                    }`}
                  />
                  {linkUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6L6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Text Section */}
          <div className={`space-y-4 ${orientation === "imageRight" ? "md:order-1" : ""}`}>
            <div className="space-y-2">
              <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${
                linkUrl ? "group-hover:text-primary-dark transition-colors duration-300" : ""
              }`}>
                {title}
                {linkUrl && (
                  <ArrowUpRight className="inline-block ml-2 h-6 w-6 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </h2>
              {linkUrl && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {isExternal ? (
                      <>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        External Link
                      </>
                    ) : (
                      "Learn More"
                    )}
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {text}
            </p>
            {linkUrl && (
              <div className="pt-2">
                <span className="text-sm text-primary font-medium group-hover:underline">
                  Click to explore →
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (linkUrl) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link
            href={linkUrl}
            target={shouldOpenInNewTab ? "_blank" : undefined}
            rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
            className="block"
          >
            {content}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};

export default Section;
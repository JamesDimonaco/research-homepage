import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Publication } from "../types/sanity";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const query = `*[_type == "publication"]`;

export default async function Publications() {
  const publications = await sanityFetch<Publication[]>({ query });

  return (
    <main className="bg-background py-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
          Publications
        </h1>
        <div className="grid grid-cols-1 gap-8">
          {publications.map((publication, index) => {
            const image = publication.image
              ? urlForImage(publication.image)
              : null;
            return (
              <Card key={index} className="overflow-hidden">
                <div className="md:flex">
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {publication.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(publication.publicationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {publication.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="default">
                        <Link
                          href={publication.googleScholarLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {publication.linkButtonText || "Read on Google Scholar"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                  {image && (
                    <div className="md:w-[300px] p-6">
                      <Image
                        src={image}
                        width={300}
                        height={300}
                        alt={publication.title}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}

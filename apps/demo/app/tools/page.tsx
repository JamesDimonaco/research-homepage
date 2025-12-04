import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Tool } from "../types/sanity";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const query = `*[_type == "tool"]`;

export default async function Tools() {
  const tools = await sanityFetch<Tool[]>({ query });

  return (
    <main className="bg-background py-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
          Tools
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const image = tool.image ? urlForImage(tool.image) : null;
            return (
              <Card key={index} className="flex flex-col">
                {image && (
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={image}
                      alt={tool.name}
                      fill
                      className="object-contain rounded-t-lg bg-white"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={tool.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      {tool.linkButtonText || "View on GitHub"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}

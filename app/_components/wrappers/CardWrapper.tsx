import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";

interface CardProps {
  header?: {
    title?: string;
    description?: string;
  };
  content?: any[]; // This will be the Portable Text content
  footer?: {
    text?: string;
  };
  includeHeader?: boolean;
  includeFooter?: boolean;
}

const CardWrapper: React.FC<CardProps> = ({
  header,
  content,
  footer,
  includeHeader = true,
  includeFooter = true,
}) => {
  return (
    <Card>
      {includeHeader && header && (
        <CardHeader>
          {header.title && <CardTitle>{header.title}</CardTitle>}
          {header.description && (
            <CardDescription>{header.description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent>
        {content && (
          <PortableText
            value={content}
            components={{
              types: {
                image: ({ value }) => {
                  return (
                    <Image
                      src={urlForImage(value)}
                      alt={value.alt || " "}
                      className="w-full h-auto"
                    />
                  );
                },
              },
            }}
          />
        )}
      </CardContent>
      {includeFooter && footer && <CardFooter>{footer.text}</CardFooter>}
    </Card>
  );
};

export default CardWrapper;

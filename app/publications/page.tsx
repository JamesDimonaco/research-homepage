import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Publication } from "../types/sanity";

const query = `*[_type == "publication"]`;

export default async function Publications() {
  const publications = await sanityFetch<Publication[]>({ query });

  return (
    <main className="bg-gray-100 dark:bg-gray-900 py-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Publications
        </h1>
        <ul className="grid grid-cols-1 gap-8">
          {publications.map((publication, index) => {
            const image = publication.image
              ? urlForImage(publication.image)
              : null;
            return (
              <li
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {publication.title}
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 mb-6 md:flex md:gap-6">
                    <div className="flex-1">
                      <p>{publication.description}</p>
                    </div>
                    {image ? (
                      <Image
                        src={image}
                        width={300}
                        height={300}
                        alt={publication.title}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="w-[300px] h-[300px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-gray-400 dark:text-gray-600"
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
                  </div>
                  <div className="flex justify-between">
                    <Link
                      href={publication.googleScholarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      prefetch={false}
                    >
                      {publication.linkButtonText || "Read on Google Scholar"}
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Published at:{" "}
                      {
                        new Date(publication.publicationDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

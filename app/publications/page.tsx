import { sanityFetch } from "@/sanity/lib/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";

const query = `*[_type == "publication"]`;

export default async function Publications() {
  const publications = await sanityFetch<SanityDocument[]>({ query });

  return (
    <main className="bg-gray-100 dark:bg-gray-900 py-24 h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Publications
        </h1>
        <ul className="grid grid-cols-1  gap-8">
          {publications.map((publication, index) => (
            <li
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {publication.description.substring(0, 300)}...
                </p>
                <div className="flex justify-between">
                  <Link
                    href={publication.googleScholarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    prefetch={false}
                  >
                    Read on Google Scholar
                  </Link>
                  <span className="text-gray-300 font-bold">
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
          ))}
        </ul>
      </div>
    </main>
  );
}

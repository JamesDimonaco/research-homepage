import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Tool } from "../types/sanity";

const query = `*[_type == "tool"]`;

export default async function Tools() {
  const tools = await sanityFetch<Tool[]>({ query });

  return (
    <main className="bg-gray-100 dark:bg-gray-900 py-24 h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Tools
        </h1>
        <ul className="grid grid-cols-1  gap-8">
          {tools.map((tool, index) => {
            const image = tool.image ? urlForImage(tool.image) : null;
            return (
              <li
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 md:flex md:justify-between">
                    {tool.description}
                    {image ? (
                      <Image
                        src={image}
                        width={300}
                        height={300}
                        alt={tool.name}
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
                  </p>
                  <Link
                    href={tool.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    prefetch={false}
                  >
                    View on GitHub
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

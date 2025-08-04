import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import { Section as SectionType } from "../types/sanity";

interface SectionProps extends SectionType {
  key?: number;
}

const Section = ({ title, image, text, orientation }: SectionProps) => {
  const imageUrl = image ? urlForImage(image) : null;

  return (
    <section className="bg-white dark:bg-gray-800 py-16">
      {orientation === "imageLeft" ? (
        <>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  width={600}
                  height={400}
                  alt={title}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
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
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {text}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {text}
              </p>
            </div>
            <div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  width={600}
                  height={400}
                  alt={title}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
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
          </div>
        </>
      )}
    </section>
  );
};

export default Section;

import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";

export type ISection = {
  title: string;
  text: string;
  image: {
    url: string;
    alt: string;
  } | null;
  orientation: "imageLeft" | "imageRight";
  key: number;
};

const Section = ({ title, image, text, orientation, key }: ISection) => {
  const imageUrl = image ? urlForImage(image) : null;

  return (
    <section key={key} className="bg-white dark:bg-gray-800 py-16">
      {orientation === "imageLeft" ? (
        <>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src={imageUrl || ""}
                width={600}
                height={400}
                alt="Research Image"
                className="rounded-lg"
              />
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
              <Image
                src={imageUrl || ""}
                width={600}
                height={400}
                alt="Research Image"
                className="rounded-lg"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Section;

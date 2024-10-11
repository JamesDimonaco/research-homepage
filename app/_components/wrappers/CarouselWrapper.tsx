import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/_components/ui/carousel";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";

interface CarouselItemContent {
  _type: string;
  [key: string]: any;
}

interface CarouselItem {
  title: string;
  content: CarouselItemContent[];
}

interface CarouselProps {
  items: CarouselItem[];
  showArrows: boolean;
  autoPlay: boolean;
  interval: number;
}

const CarouselWrapper: React.FC<CarouselProps> = ({
  items,
  showArrows,
  autoPlay,
  interval,
}) => {
  console.log(items);

  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    const handleAutoPlay = () => {
      api.scrollNext();
    };

    if (autoPlay) {
      intervalRef.current = setInterval(handleAutoPlay, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, autoPlay, interval]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <h3>{item.title}</h3>
            <PortableText
              value={item.content}
              components={{
                types: {
                  image: ({ value }) => (
                    <Image
                      src={urlForImage(value)}
                      alt={value.alt || " "}
                      width={500} // Adjust as needed
                      height={300} // Adjust as needed
                      className="w-full h-auto"
                    />
                  ),
                },
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {showArrows && (
        <>
          <CarouselPrevious label="Previous" />
          <CarouselNext label="Next" />
        </>
      )}
    </Carousel>
  );
};

export default CarouselWrapper;

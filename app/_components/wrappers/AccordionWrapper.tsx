// AccordionWrapper.tsx
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";

interface AccordionWrapperProps {
  title: string;
  content: string;
}

const AccordionWrapper: React.FC<AccordionWrapperProps> = ({
  title,
  content,
}) => {
  console.log(content);
  console.log(title);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionWrapper;

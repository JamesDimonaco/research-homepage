import ButtonWrapper from "./wrappers/ButtonWrapper";
import AccordionWrapper from "./wrappers/AccordionWrapper";
import CardWrapper from "./wrappers/CardWrapper";
// import CarouselWrapper from "./wrapper/CarouselWrapper";
// import CollapsibleWrapper from "./wrapper/CollapsibleWrapper";
// import CommandWrapper from "./wrapper/CommandWrapper";
// import RadioGroupWrapper from "./wrapper/RadioGroupWrapper";
// import SeparatorWrapper from "./wrapper/SeparatorWrapper";

const ComponentMap = {
  button: ButtonWrapper,
  accordion: AccordionWrapper,
  card: CardWrapper,
  // carousel: CarouselWrapper,
  // collapsible: CollapsibleWrapper,
  // command: CommandWrapper,
  // radioGroup: RadioGroupWrapper,
  // separator: SeparatorWrapper,
};

export type ComponentKey = keyof typeof ComponentMap;

export default ComponentMap;

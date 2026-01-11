import { createImageBuilder } from "@research-homepage/cms";
import { dataset, projectId } from "../env";

const { urlForImage } = createImageBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export { urlForImage };

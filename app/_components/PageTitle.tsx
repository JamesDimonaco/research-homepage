import React from "react";

const PageTitle = ({ titleText }: { titleText: string }) => (
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
    {titleText}
  </h1>
);
export default PageTitle;

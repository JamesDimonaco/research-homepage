"use client";

import { ResearchInterest } from "../types/sanity";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResearchInterestsCloudProps {
  interests: ResearchInterest[];
}

export default function ResearchInterestsCloud({ interests }: ResearchInterestsCloudProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredInterest, setHoveredInterest] = useState<string | null>(null);

  if (!interests || interests.length === 0) return null;

  const activeInterests = interests.filter(i => i.active);
  const categories = Array.from(new Set(activeInterests.map(i => i.category)));

  const categoryLabels = {
    primary: "Primary Research",
    methodology: "Methodologies",
    application: "Applications",
    technology: "Technologies",
    theory: "Theory",
    interdisciplinary: "Interdisciplinary",
  };

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    green: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20",
    purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    red: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20",
    pink: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20",
    indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
  };

  const getSizeClass = (weight: number) => {
    if (weight >= 9) return "text-2xl md:text-3xl font-bold px-6 py-3";
    if (weight >= 7) return "text-xl md:text-2xl font-semibold px-5 py-2.5";
    if (weight >= 5) return "text-lg md:text-xl font-medium px-4 py-2";
    if (weight >= 3) return "text-base md:text-lg px-3 py-1.5";
    return "text-sm md:text-base px-2 py-1";
  };

  const filteredInterests = selectedCategory
    ? activeInterests.filter(i => i.category === selectedCategory)
    : activeInterests;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Research Interests
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All Areas
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </Badge>
          ))}
        </div>

        {/* Tag Cloud */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-3 items-center justify-center min-h-[300px]">
              {filteredInterests
                .sort((a, b) => (b.weight || 5) - (a.weight || 5))
                .map((interest) => (
                  <div
                    key={interest._id}
                    className="relative group"
                    onMouseEnter={() => setHoveredInterest(interest._id)}
                    onMouseLeave={() => setHoveredInterest(null)}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "transition-all duration-300 cursor-pointer",
                        getSizeClass(interest.weight || 5),
                        colorClasses[interest.color || "blue"],
                        hoveredInterest === interest._id && "scale-110 shadow-lg"
                      )}
                    >
                      {interest.keyword}
                    </Badge>
                    
                    {/* Tooltip with description */}
                    {hoveredInterest === interest._id && interest.description && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg border z-10 max-w-xs whitespace-normal">
                        <p className="text-xs">{interest.description}</p>
                        {(interest.relatedProjects?.length || 0) > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {interest.relatedProjects?.length} related project{interest.relatedProjects?.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Legend */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Interest size reflects research focus intensity
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-xs">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const count = activeInterests.filter(i => i.category === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <span>{label} ({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
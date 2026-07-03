"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        capture_performance: true,
      });
    }
  }, []);

  useReportWebVitals((metric) => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture("web_vitals", {
      metric_name: metric.name,
      metric_value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      metric_rating: metric.rating,
      metric_id: metric.id,
    });
  });

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

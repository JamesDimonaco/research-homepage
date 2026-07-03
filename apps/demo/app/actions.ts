"use server";

import { headers } from "next/headers";

export type InquiryState = {
  ok: boolean;
  message: string;
} | null;

// Field length caps — reject oversized payloads before they reach Resend.
const LIMITS = { name: 200, email: 200, orcid: 60, currentSite: 300, note: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory per-IP throttle. Note: serverless instances don't share
// memory, so this caps abuse per warm instance, not globally — good enough to
// blunt casual hammering; swap for Upstash/Redis if real abuse appears.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function submitInquiry(formData: FormData): Promise<InquiryState> {
  // Honeypot — bots fill everything
  if (formData.get("website")) {
    return { ok: true, message: "Received — I'll be in touch within a day." };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return {
      ok: false,
      message: "Too many requests — please try again later, or email james@dimonaco.co.uk.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const orcid = String(formData.get("orcid") ?? "").trim();
  const currentSite = String(formData.get("currentSite") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name || !EMAIL_RE.test(email)) {
    return { ok: false, message: "A name and a valid email are required." };
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    orcid.length > LIMITS.orcid ||
    currentSite.length > LIMITS.currentSite ||
    note.length > LIMITS.note
  ) {
    return { ok: false, message: "One of those fields is too long." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[inquiry] RESEND_API_KEY not set — inquiry from", email);
    return {
      ok: false,
      message:
        "The form isn't wired up yet — email james@dimonaco.co.uk directly.",
    };
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    orcid &&
      `ORCID: https://orcid.org/${orcid.replace(/^https?:\/\/orcid\.org\//, "")}`,
    currentSite && `Current page: ${currentSite}`,
    note && `\nNote:\n${note}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM ??
          "Research Homepage <onboarding@resend.dev>",
        to: [process.env.INQUIRY_TO ?? "james@dimonaco.co.uk"],
        reply_to: email,
        // Strip control chars from the subject (defence in depth — Resend's JSON
        // API isn't header-injectable, but keep the subject clean regardless).
        subject: `Research Homepage inquiry — ${name.replace(/[\r\n\t]+/g, " ")}`,
        text: lines,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[inquiry] Resend error", res.status, body);
      return {
        ok: false,
        message:
          "Something went wrong sending that — email james@dimonaco.co.uk directly.",
      };
    }

    return { ok: true, message: "Received — I'll be in touch within a day." };
  } catch (err) {
    console.error("[inquiry] send failed", err);
    return {
      ok: false,
      message:
        "Something went wrong sending that — email james@dimonaco.co.uk directly.",
    };
  }
}

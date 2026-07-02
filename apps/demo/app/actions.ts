"use server";

export type InquiryState = {
  ok: boolean;
  message: string;
} | null;

export async function submitInquiry(formData: FormData): Promise<InquiryState> {
  // Honeypot — bots fill everything
  if (formData.get("website")) {
    return { ok: true, message: "Received — I'll be in touch within a day." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const orcid = String(formData.get("orcid") ?? "").trim();
  const currentSite = String(formData.get("currentSite") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name || !email || !email.includes("@")) {
    return { ok: false, message: "A name and a valid email are required." };
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
        subject: `Research Homepage inquiry — ${name}`,
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

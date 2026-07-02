"use client";

import { useState, useTransition } from "react";
import { Button, Input, cn } from "@research-homepage/ui";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitInquiry, type InquiryState } from "../actions";

const fieldClasses =
  "bg-background/60 border-border/70 focus-visible:ring-primary/40 h-11";

export function InquiryForm() {
  const [state, setState] = useState<InquiryState>(null);
  const [pending, startTransition] = useTransition();

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-secondary/40 bg-secondary/5 px-8 py-12 text-center">
        <CheckCircle2 className="h-8 w-8 text-secondary" />
        <p className="font-serif text-xl">{state.message}</p>
        <p className="text-sm text-muted-foreground">
          Have your ORCID iD handy — it makes setup faster.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) =>
        startTransition(async () => setState(await submitInquiry(formData)))
      }
      className="space-y-5"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Name <span className="text-accent">*</span>
          </span>
          <Input name="name" required placeholder="Dr. Ada Lovelace" className={fieldClasses} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email <span className="text-accent">*</span>
          </span>
          <Input
            name="email"
            type="email"
            required
            placeholder="a.lovelace@university.ac.uk"
            className={fieldClasses}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            ORCID iD <span className="normal-case tracking-normal">(optional, speeds things up)</span>
          </span>
          <Input name="orcid" placeholder="0000-0002-1825-0097" className={fieldClasses} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current page <span className="normal-case tracking-normal">(optional)</span>
          </span>
          <Input
            name="currentSite"
            placeholder="university.edu/~alovelace"
            className={fieldClasses}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Anything else <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <textarea
          name="note"
          rows={4}
          placeholder="A lab site for six people, a personal page, a deadline before a conference…"
          className={cn(
            "flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1",
            fieldClasses,
            "h-auto"
          )}
        />
      </label>

      {state && !state.ok && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">
          No mailing list. Your details go to James, once.
        </p>
        <Button type="submit" size="lg" disabled={pending} className="group">
          {pending ? "Sending…" : "Request your site"}
          {!pending && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </div>
    </form>
  );
}

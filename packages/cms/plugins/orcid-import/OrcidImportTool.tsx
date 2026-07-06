"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useClient } from "sanity";
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Heading,
  Inline,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import {
  DownloadIcon,
  CheckmarkCircleIcon,
  SearchIcon,
  WarningOutlineIcon,
  UserIcon,
} from "@sanity/icons";
import {
  fetchWorksByOrcid,
  fetchAuthorByOrcid,
  normaliseDoi,
  normaliseOrcid,
  type MappedWork,
  type AuthorProfile,
} from "./openalex";

const API_VERSION = "2024-06-10";

type Phase = "idle" | "fetching" | "review" | "importing" | "done";
type ProfilePhase = "idle" | "applying" | "done";

export function OrcidImportTool() {
  const client = useClient({ apiVersion: API_VERSION });

  const [orcidInput, setOrcidInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [works, setWorks] = useState<MappedWork[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [importedCount, setImportedCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [activeOrcid, setActiveOrcid] = useState<string | null>(null);
  const [profilePhase, setProfilePhase] = useState<ProfilePhase>("idle");

  const selectableCount = useMemo(
    () => works.filter((w) => !w.alreadyExists).length,
    [works],
  );
  const selectedCount = useMemo(
    () => works.filter((w) => selected[w.key] && !w.alreadyExists).length,
    [works, selected],
  );

  const handleFetch = useCallback(async () => {
    const orcidId = normaliseOrcid(orcidInput);
    if (!orcidId) {
      setError("That doesn't look like an ORCID iD (e.g. 0000-0002-1825-0097).");
      return;
    }

    setPhase("fetching");
    setError(null);
    setWorks([]);
    setSelected({});
    setImportedCount(0);
    setAuthor(null);
    setActiveOrcid(orcidId);
    setProfilePhase("idle");

    try {
      // Author profile is best-effort — a missing record shouldn't block the
      // publication import, so we swallow its errors and just skip the card.
      const [worksResult, authorResult] = await Promise.all([
        fetchWorksByOrcid(orcidId),
        fetchAuthorByOrcid(orcidId).catch(() => null),
      ]);
      const { works: fetched, total: count } = worksResult;
      setAuthor(authorResult);

      if (!fetched.length) {
        setError(
          "No works found on OpenAlex for that ORCID iD. Double-check the iD, or the record may not be indexed yet.",
        );
        setPhase("idle");
        return;
      }

      // Dedupe against publications already in the dataset.
      const existingDois: string[] = await client.fetch(
        `*[_type == "publication" && defined(doi)].doi`,
      );
      const existing = new Set(
        existingDois.map((d) => normaliseDoi(d)).filter(Boolean) as string[],
      );

      const withFlags = fetched.map((w) => ({
        ...w,
        alreadyExists: w.doi ? existing.has(w.doi) : false,
      }));

      // Pre-select everything new; leave existing unchecked.
      const preselect: Record<string, boolean> = {};
      for (const w of withFlags) preselect[w.key] = !w.alreadyExists;

      setWorks(withFlags);
      setSelected(preselect);
      setTotal(count);
      setPhase("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("idle");
    }
  }, [orcidInput, client]);

  // RH-25: set up the site profile (homePage singleton) from the ORCID/OpenAlex
  // record — name + affiliation + the ORCID iD itself. Writes a DRAFT and only
  // fills blanks, so existing content (bio, image, sections) is never clobbered.
  const handleApplyProfile = useCallback(async () => {
    if (!activeOrcid) return;
    setProfilePhase("applying");
    setError(null);
    try {
      const existing = await client.fetch(
        `*[_type == "homePage"] | order(_updatedAt desc)[0]`,
      );
      const baseId: string = existing?._id
        ? existing._id.replace(/^drafts\./, "")
        : "homePage";
      const draftId = `drafts.${baseId}`;

      // Seed a draft from whatever exists (published or newest) so bio / image /
      // sections are never lost — but createIfNotExists is a no-op when the draft
      // already exists, so an in-progress draft is left untouched.
      const seed: Record<string, any> = existing
        ? { ...existing, _id: draftId }
        : { _id: draftId, _type: "homePage" };
      delete seed._rev;
      delete seed._createdAt;
      delete seed._updatedAt;
      await client.createIfNotExists(seed as any);

      // Fill only blank fields via setIfMissing (operates on current draft
      // state, keeps _rev concurrency — no stale-snapshot clobber). The ORCID
      // iD is always (re)bound, which is the whole point of the action.
      await client
        .patch(draftId)
        .setIfMissing({
          ...(author?.displayName ? { name: author.displayName } : {}),
          ...(author?.institution ? { affiliation: author.institution } : {}),
        })
        .set({ orcid: activeOrcid })
        .commit();
      setProfilePhase("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Couldn't set up the profile: ${err.message}`
          : "Couldn't set up the profile.",
      );
      setProfilePhase("idle");
    }
  }, [activeOrcid, author, client]);

  const toggle = useCallback((key: string) => {
    setSelected((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const setAll = useCallback(
    (value: boolean) => {
      setSelected(() => {
        const next: Record<string, boolean> = {};
        for (const w of works) next[w.key] = value && !w.alreadyExists;
        return next;
      });
    },
    [works],
  );

  const handleImport = useCallback(async () => {
    const toImport = works.filter((w) => selected[w.key] && !w.alreadyExists);
    if (!toImport.length) return;

    setPhase("importing");
    setError(null);
    let created = 0;

    try {
      for (const w of toImport) {
        await client.create({
          // `drafts.` prefix → lands in the editor as an unpublished draft.
          _id: `drafts.orcid-${Math.abs(hash(w.key)).toString(36)}-${created}`,
          _type: "publication",
          title: w.title,
          status: w.status,
          ...(w.year ? { year: w.year } : {}),
          ...(w.publicationDate ? { publicationDate: w.publicationDate } : {}),
          ...(w.journal ? { journal: w.journal } : {}),
          ...(w.authors ? { authors: w.authors } : {}),
          ...(w.description ? { description: w.description } : {}),
          ...(w.doi ? { doi: w.doi } : {}),
          ...(w.preprintLink ? { preprintLink: w.preprintLink } : {}),
          ...(w.pdfLink ? { pdfLink: w.pdfLink } : {}),
          featured: false,
        });
        created += 1;
      }
      setImportedCount(created);
      setPhase("done");
    } catch (err) {
      setError(
        `Imported ${created} before an error: ${
          err instanceof Error ? err.message : "unknown"
        }. Safe to retry — duplicates are skipped.`,
      );
      setImportedCount(created);
      setPhase("review");
    }
  }, [works, selected, client]);

  const showFooter =
    (phase === "review" || phase === "importing") && works.length > 0;

  return (
    <Flex direction="column" height="fill">
      {/* Scrollable content — the Studio tool pane is fixed-height with
          overflow hidden, so the tool has to own its own scroll region.
          Without this the list pushes the import CTA below the fold and it
          can't be reached. */}
      <Box flex={1} overflow="auto" paddingX={4} paddingTop={5} paddingBottom={4}>
        <Container width={2}>
          <Stack space={5}>
            <Stack space={3}>
              <Heading size={3}>Import publications from ORCID</Heading>
              <Text size={1} muted>
                Enter an ORCID iD to pull the researcher&rsquo;s publications from
                OpenAlex. Review the list, then import — each one is created as a{" "}
                <strong>draft</strong> for you to check before publishing. Anything
                already in the site is detected and skipped.
              </Text>
            </Stack>

            <Flex gap={2}>
              <Box flex={1}>
                <TextInput
                  icon={SearchIcon}
                  placeholder="0000-0002-1825-0097  or  https://orcid.org/0000-0002-1825-0097"
                  value={orcidInput}
                  onChange={(e) => setOrcidInput(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                  disabled={phase === "fetching" || phase === "importing"}
                />
              </Box>
              <Button
                text={phase === "fetching" ? "Fetching…" : "Fetch works"}
                tone="primary"
                icon={phase === "fetching" ? Spinner : SearchIcon}
                disabled={
                  phase === "fetching" || phase === "importing" || !orcidInput
                }
                onClick={handleFetch}
              />
            </Flex>

            {error && (
              <Card padding={3} radius={2} tone="critical" shadow={1}>
                <Flex align="center" gap={2}>
                  <Text size={1}>
                    <WarningOutlineIcon />
                  </Text>
                  <Text size={1}>{error}</Text>
                </Flex>
              </Card>
            )}

            {phase === "done" && (
              <Card padding={4} radius={2} tone="positive" shadow={1}>
                <Flex align="center" gap={3}>
                  <Text size={3}>
                    <CheckmarkCircleIcon />
                  </Text>
                  <Stack space={2}>
                    <Text size={2} weight="semibold">
                      Imported {importedCount} publication
                      {importedCount === 1 ? "" : "s"} as drafts.
                    </Text>
                    <Text size={1} muted>
                      Open the Publications list to review and publish them.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            )}

            {(phase === "review" || phase === "importing") && author && (
              <Card
                padding={3}
                radius={2}
                shadow={1}
                tone={profilePhase === "done" ? "positive" : "primary"}
              >
                <Flex align="flex-start" gap={3}>
                  <Text size={2}>
                    <UserIcon />
                  </Text>
                  <Stack space={3} flex={1}>
                    <Stack space={2}>
                      <Text size={1} weight="semibold">
                        {profilePhase === "done"
                          ? "Profile drafted"
                          : "Set up the site profile"}
                      </Text>
                      <Text size={1} muted>
                        {author.displayName ?? "This researcher"}
                        {author.institution ? ` · ${author.institution}` : ""}
                      </Text>
                      <Text size={1} muted>
                        {profilePhase === "done"
                          ? "Saved as a draft of the Home Page — name, affiliation and ORCID iD. Review and publish it there."
                          : "Fills the Home Page name, affiliation and ORCID iD as a draft — your bio, photo and sections are left untouched."}
                      </Text>
                    </Stack>
                    {profilePhase !== "done" && (
                      <Box>
                        <Button
                          text={
                            profilePhase === "applying"
                              ? "Setting up…"
                              : "Set up profile"
                          }
                          tone="primary"
                          icon={profilePhase === "applying" ? Spinner : UserIcon}
                          disabled={profilePhase === "applying"}
                          onClick={handleApplyProfile}
                        />
                      </Box>
                    )}
                  </Stack>
                </Flex>
              </Card>
            )}

            {(phase === "review" || phase === "importing") &&
              works.length > 0 && (
                <Stack space={3}>
                  <Flex align="center" justify="space-between">
                    <Text size={1} muted>
                      {works.length} shown
                      {total > works.length ? ` of ${total}` : ""} ·{" "}
                      {selectableCount} new · {selectedCount} selected
                    </Text>
                    <Inline space={2}>
                      <Button
                        mode="ghost"
                        fontSize={1}
                        text="Select all new"
                        onClick={() => setAll(true)}
                        disabled={phase === "importing"}
                      />
                      <Button
                        mode="ghost"
                        fontSize={1}
                        text="Clear"
                        onClick={() => setAll(false)}
                        disabled={phase === "importing"}
                      />
                    </Inline>
                  </Flex>

                  <Stack space={2}>
                    {works.map((w) => (
                      <Card
                        key={w.key}
                        padding={3}
                        radius={2}
                        shadow={1}
                        tone={w.alreadyExists ? "transparent" : "default"}
                      >
                        <Flex gap={3} align="flex-start">
                          <Box paddingTop={1}>
                            <Checkbox
                              checked={!!selected[w.key] && !w.alreadyExists}
                              disabled={w.alreadyExists || phase === "importing"}
                              onChange={() => toggle(w.key)}
                            />
                          </Box>
                          <Stack space={2} flex={1}>
                            <Text size={1} weight="semibold">
                              {w.title}
                            </Text>
                            <Inline space={2}>
                              {w.year && (
                                <Badge tone="primary" fontSize={0}>
                                  {w.year}
                                </Badge>
                              )}
                              <Badge
                                tone={
                                  w.status === "preprint"
                                    ? "caution"
                                    : "positive"
                                }
                                fontSize={0}
                              >
                                {w.status}
                              </Badge>
                              {w.alreadyExists && (
                                <Badge tone="default" fontSize={0}>
                                  already on site
                                </Badge>
                              )}
                            </Inline>
                            {w.journal && (
                              <Text size={1} muted>
                                {w.journal}
                              </Text>
                            )}
                            {w.doi && (
                              <Text size={0} muted>
                                doi:{w.doi}
                              </Text>
                            )}
                          </Stack>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              )}
          </Stack>
        </Container>
      </Box>

      {/* Sticky action bar — the primary CTA stays put no matter how long
          the list is, instead of hiding below the fold. */}
      {showFooter && (
        <Card borderTop paddingX={4} paddingY={3} tone="default">
          <Container width={2}>
            <Flex align="center" justify="space-between" gap={3}>
              <Text size={1} muted>
                {selectedCount} of {selectableCount} selected
              </Text>
              <Button
                text={
                  phase === "importing"
                    ? "Importing…"
                    : `Import ${selectedCount} as draft${
                        selectedCount === 1 ? "" : "s"
                      }`
                }
                tone="primary"
                icon={phase === "importing" ? Spinner : DownloadIcon}
                disabled={phase === "importing" || selectedCount === 0}
                onClick={handleImport}
              />
            </Flex>
          </Container>
        </Card>
      )}
    </Flex>
  );
}

// Small deterministic hash so re-imports of the same work reuse an id shape.
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

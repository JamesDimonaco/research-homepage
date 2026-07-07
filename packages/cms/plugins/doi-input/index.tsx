"use client";

import React, { useState } from "react";
import { StringInputProps, set, unset, useClient, useFormValue } from "sanity";
import { Stack, Text, TextInput, Button, Card, Box, Flex } from "@sanity/ui";
import { SearchIcon, CheckmarkIcon, ErrorOutlineIcon } from "@sanity/icons";

const API_VERSION = "2024-06-10";

export interface DoiInputConfig {
  apiPath?: string;
}

export function createDoiInput(config: DoiInputConfig = {}) {
  const { apiPath = "/api/doi" } = config;

  return function DoiInput(props: StringInputProps) {
    const { onChange, value } = props;
    const client = useClient({ apiVersion: API_VERSION });
    // The id of the document currently open in the editor (draft or published),
    // so we can write the fetched metadata straight into its sibling fields.
    const documentId = useFormValue(["_id"]) as string | undefined;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fetchedData, setFetchedData] = useState<any>(null);

    const fetchDoiDetails = async () => {
      if (!value) {
        setError("Please enter a DOI");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // The Studio is embedded in the same Next.js app that serves the DOI
        // route, so a same-origin relative request is all that's needed. (The
        // old absolute/port-rewriting logic mangled the production origin into
        // an invalid URL, which returned an HTML 404 — hence the "Unexpected
        // token '<'" JSON error.)
        const response = await fetch(`${apiPath}?doi=${encodeURIComponent(value)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(errorData.error || `Failed to fetch DOI details: ${response.status}`);
        }

        const data = await response.json();

        // Auto-fill the sibling fields. The DOI route already returns values
        // shaped to the publication schema (abstract → description). We only set
        // fields the lookup actually resolved, so blanks never clobber anything.
        if (documentId) {
          const patch: Record<string, unknown> = {};
          if (data.title) patch.title = data.title;
          if (data.authors) patch.authors = data.authors;
          if (data.journal) patch.journal = data.journal;
          if (typeof data.year === "number") patch.year = data.year;
          if (data.publicationDate) patch.publicationDate = data.publicationDate;
          if (data.abstract) patch.description = data.abstract;
          if (data.status) patch.status = data.status;
          if (Object.keys(patch).length > 0) {
            await client.patch(documentId).set(patch).commit();
          }
        }

        setSuccess(true);
        setFetchedData(data);
      } catch (err) {
        console.error("DOI fetch error:", err);
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError("Network error: Make sure the Next.js dev server is running");
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Stack space={3}>
        <Stack space={2}>
          <Text size={1} muted>
            Enter just the DOI number (e.g., "10.1101/2025.05.30.657108") or the full URL
          </Text>
        </Stack>

        <Flex gap={2}>
          <Box flex={1}>
            <TextInput
              value={value || ""}
              onChange={(event) => {
                const newValue = event.currentTarget.value;
                onChange(newValue ? set(newValue) : unset());
                setError(null);
                setSuccess(false);
              }}
              placeholder="10.1101/2025.05.30.657108"
            />
          </Box>
          <Button
            text="Fetch Details"
            icon={SearchIcon}
            onClick={fetchDoiDetails}
            disabled={isLoading || !value}
            loading={isLoading}
            tone="primary"
          />
        </Flex>

        {error && (
          <Card tone="critical" padding={2} radius={2}>
            <Text size={1}>
              <ErrorOutlineIcon /> {error}
            </Text>
          </Card>
        )}

        {success && fetchedData && (
          <Card tone="positive" padding={3} radius={2}>
            <Stack space={3}>
              <Text size={1}>
                <CheckmarkIcon /> Fetched and filled in the fields below.
              </Text>
              <Stack space={2}>
                <Text size={1} weight="semibold">Applied values:</Text>
                {fetchedData.title && (
                  <Box>
                    <Text size={1} muted>Title:</Text>
                    <Text size={1}>{fetchedData.title}</Text>
                  </Box>
                )}
                {fetchedData.authors && (
                  <Box>
                    <Text size={1} muted>Authors:</Text>
                    <Text size={1}>{fetchedData.authors}</Text>
                  </Box>
                )}
                {fetchedData.journal && (
                  <Box>
                    <Text size={1} muted>Journal/Venue:</Text>
                    <Text size={1}>{fetchedData.journal}</Text>
                  </Box>
                )}
                {fetchedData.year && (
                  <Box>
                    <Text size={1} muted>Year:</Text>
                    <Text size={1}>{fetchedData.year}</Text>
                  </Box>
                )}
                {fetchedData.status && (
                  <Box>
                    <Text size={1} muted>Status:</Text>
                    <Text size={1}>{fetchedData.status}</Text>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Card>
        )}

        <Box marginTop={2}>
          <Card tone="transparent" border padding={3} radius={2}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                How to find a DOI:
              </Text>
              <Text size={1} muted>
                • Published papers: Usually on the first page or in the header
              </Text>
              <Text size={1} muted>
                • Preprints: On bioRxiv, arXiv, etc., look for the DOI link
              </Text>
              <Text size={1} muted>
                • Example: bioRxiv shows "https://doi.org/10.1101/..." near the title
              </Text>
            </Stack>
          </Card>
        </Box>
      </Stack>
    );
  };
}

// Default export for backward compatibility
export const DoiInput = createDoiInput();

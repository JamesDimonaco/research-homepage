import React, { useState } from "react";
import { StringInputProps, set, unset } from "sanity";
import { Stack, Text, TextInput, Button, Card, Box, Flex } from "@sanity/ui";
import { SearchIcon, CheckmarkIcon, ErrorOutlineIcon } from "@sanity/icons";

export function DoiInput(props: StringInputProps) {
  const { onChange, value } = props;
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
      // Determine the correct port based on current location
      const currentPort = window.location.port;
      const apiPort = currentPort === "3333" ? "3000" : "3000"; // Always use 3000 for API
      const baseUrl = window.location.hostname === "localhost" 
        ? `http://localhost:${apiPort}` 
        : window.location.origin.replace(`:${currentPort}`, ":3000");
      
      console.log(`Fetching from: ${baseUrl}/api/doi?doi=${encodeURIComponent(value)}`);
      
      const response = await fetch(`${baseUrl}/api/doi?doi=${encodeURIComponent(value)}`, {
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
      setSuccess(true);
      setFetchedData(data);
      
      // Note: In Sanity Studio, we can't directly update other fields from this component
      // The user will need to manually copy the fetched data or we need a different approach
    } catch (err) {
      console.error("DOI fetch error:", err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError("Network error: Make sure the Next.js dev server is running on port 3002");
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
              <CheckmarkIcon /> Successfully fetched publication details!
            </Text>
            <Stack space={2}>
              <Text size={1} weight="semibold">Fetched data (copy to fields above):</Text>
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
}
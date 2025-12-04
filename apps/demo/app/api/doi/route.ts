import { NextResponse } from "next/server";

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }
  const { searchParams } = new URL(request.url);
  const doi = searchParams.get("doi");

  if (!doi) {
    return NextResponse.json({ error: "DOI is required" }, { status: 400, headers });
  }

  // Clean the DOI - remove any URL prefix if present
  const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, "");

  try {
    // Use Crossref API to fetch publication details
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`,
      {
        headers: {
          "User-Agent": "Research-Homepage/1.0 (https://github.com/jamesdimonaco/research-homepage)",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "DOI not found" }, { status: 404, headers });
      }
      throw new Error(`Crossref API error: ${response.status}`);
    }

    const data = await response.json();
    const work = data.message;

    // Extract relevant information
    const publicationData = {
      title: work.title?.[0] || "",
      authors: work.author ? work.author.map((author: any) => {
        let name = "";
        if (author.family) {
          name = author.family;
          if (author.given) {
            name = name + " " + author.given[0] + ".";
          }
        }
        return name;
      }).join(", ") : "",
      journal: work["container-title"]?.[0] || work.publisher || "",
      year: work.published?.["date-parts"]?.[0]?.[0] || work.posted?.["date-parts"]?.[0]?.[0] || work.created?.["date-parts"]?.[0]?.[0] || null,
      publicationDate: work.published?.["date-parts"]?.[0]
        ? `${work.published["date-parts"][0][0]}-${String(work.published["date-parts"][0][1] || 1).padStart(2, "0")}-${String(work.published["date-parts"][0][2] || 1).padStart(2, "0")}`
        : work.posted?.["date-parts"]?.[0]
        ? `${work.posted["date-parts"][0][0]}-${String(work.posted["date-parts"][0][1] || 1).padStart(2, "0")}-${String(work.posted["date-parts"][0][2] || 1).padStart(2, "0")}`
        : null,
      doi: cleanDoi,
      abstract: work.abstract ? stripHtml(work.abstract) : "",
      type: work.type || "",
      subtype: work.subtype || "",
      status: determineStatus(work),
    };

    return NextResponse.json(publicationData, { headers });
  } catch (error) {
    console.error("Error fetching DOI details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch DOI details", details: errorMessage },
      { status: 500, headers }
    );
  }
}

function determineStatus(work: any): string {
  // Check if it's a preprint
  if (work.subtype === "preprint" || work.type === "posted-content") {
    return "preprint";
  }
  
  // Check if published
  if (work.published || work["journal-issue"]) {
    return "published";
  }
  
  // Default to preprint for bioRxiv/arXiv/etc
  const preprintServers = ["biorxiv", "arxiv", "medrxiv", "chemrxiv", "ssrn"];
  const publisher = work.publisher?.toLowerCase() || "";
  if (preprintServers.some(server => publisher.includes(server))) {
    return "preprint";
  }
  
  return "published";
}

function stripHtml(html: string): string {
  // Remove HTML tags
  return html.replace(/<[^>]*>/g, "").trim();
}
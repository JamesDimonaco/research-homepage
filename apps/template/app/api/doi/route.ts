import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const doi = searchParams.get("doi");

  if (!doi) {
    return NextResponse.json({ error: "DOI is required" }, { status: 400 });
  }

  try {
    // Fetch from Crossref API
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "DOI not found" }, { status: 404 });
      }
      throw new Error(`Crossref API error: ${response.status}`);
    }

    const data = await response.json();
    const work = data.message;

    // Extract relevant fields
    const result = {
      title: work.title?.[0] || "",
      authors:
        work.author
          ?.map(
            (a: { given?: string; family?: string }) =>
              `${a.given || ""} ${a.family || ""}`.trim()
          )
          .join(", ") || "",
      journal:
        work["container-title"]?.[0] ||
        work["short-container-title"]?.[0] ||
        "",
      year: work.published?.["date-parts"]?.[0]?.[0] || null,
      publicationDate: work.published?.["date-parts"]?.[0]
        ? work.published["date-parts"][0].join("-")
        : null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("DOI lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch DOI information" },
      { status: 500 }
    );
  }
}

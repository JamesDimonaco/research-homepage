import { sanityFetch } from "@/sanity/lib/client";
import { Conference } from "../types/sanity";
import ConferenceCard from "../components/ConferenceCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conferencesQuery = `*[_type == "conference"] | order(coalesce(order, 0), featured desc, date desc) {
  ...,
  "relatedPublication": relatedPublication->
}`;

export default async function ConferencesPage() {
  const conferences = await sanityFetch<Conference[]>({ query: conferencesQuery });

  const conferencesByType = {
    keynote: conferences.filter(c => c.type === "keynote"),
    invited: conferences.filter(c => c.type === "invited"),
    conference: conferences.filter(c => c.type === "conference"),
    other: conferences.filter(c => !["keynote", "invited", "conference"].includes(c.type)),
  };

  const currentYear = new Date().getFullYear();
  const recentConferences = conferences.filter(c => {
    const year = new Date(c.date).getFullYear();
    return year >= currentYear - 2;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Talks & Presentations</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Sharing research insights and findings at conferences, workshops, and seminars worldwide.
        </p>
      </div>

      {conferences.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No talks found. Add some in Sanity Studio!</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-2">{conferences.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="keynote">Keynotes</TabsTrigger>
            <TabsTrigger value="invited">Invited</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {conferences.map((conference) => (
                <ConferenceCard key={conference._id} conference={conference} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">Recent Presentations</h2>
              <p className="text-muted-foreground">Talks from the past two years</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentConferences.map((conference) => (
                <ConferenceCard key={conference._id} conference={conference} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="keynote" className="space-y-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">Keynote Presentations</h2>
              <p className="text-muted-foreground">Featured keynote addresses</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {conferencesByType.keynote.map((conference) => (
                <ConferenceCard key={conference._id} conference={conference} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invited" className="space-y-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">Invited Talks</h2>
              <p className="text-muted-foreground">Specially invited presentations</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {conferencesByType.invited.map((conference) => (
                <ConferenceCard key={conference._id} conference={conference} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">Workshops & Seminars</h2>
              <p className="text-muted-foreground">Workshops, posters, panels, and seminars</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {conferencesByType.other.map((conference) => (
                <ConferenceCard key={conference._id} conference={conference} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
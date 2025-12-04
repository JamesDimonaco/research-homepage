import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, Twitter, Github, GraduationCap } from "lucide-react";
import { ContactInfo, EmailItem } from "../types/sanity";

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

const ContactSection = ({ contactInfo }: ContactSectionProps) => {
  // Handle backward compatibility for email field
  const emails: EmailItem[] = contactInfo.emails || 
    (contactInfo.email ? [{ label: "Email", value: contactInfo.email }] : []);

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Multiple Emails */}
          {emails.map((email, index) => (
            <Link key={email._key || index} href={`mailto:${email.value}`} className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Mail className="h-8 w-8" />
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="secondary" className="mb-1">
                      {email.label}
                    </Badge>
                    <span className="text-sm text-center break-all">{email.value}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* Phone */}
          {contactInfo.phone && (
            <Link href={`tel:${contactInfo.phone}`} className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Phone className="h-8 w-8" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {/* LinkedIn */}
          {contactInfo.linkedin && (
            <Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Linkedin className="h-8 w-8" />
                  <span className="text-sm">LinkedIn</span>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {/* X (Twitter) */}
          {contactInfo.X && (
            <Link href={contactInfo.X} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Twitter className="h-8 w-8" />
                  <span className="text-sm">X (Twitter)</span>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {/* GitHub */}
          {contactInfo.github && (
            <Link href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Github className="h-8 w-8" />
                  <span className="text-sm">GitHub</span>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {/* Google Scholar */}
          {contactInfo.googleScholar && (
            <Link href={contactInfo.googleScholar} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-lg hover:bg-primary/5 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <GraduationCap className="h-8 w-8" />
                  <span className="text-sm">Google Scholar</span>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
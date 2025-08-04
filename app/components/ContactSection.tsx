import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Linkedin, Twitter } from "lucide-react";

type IContactSection = {
  email: string;
  phoneNumber: string;
  linkedin: string;
  x: string;
};

const ContactSection = ({
  email,
  phoneNumber,
  linkedin,
  x,
}: IContactSection) => {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {email && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-auto flex flex-col gap-3 py-4"
                >
                  <Link href={`mailto:${email}`}>
                    <Mail className="h-8 w-8" />
                    <span className="text-sm">{email}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {phoneNumber && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-auto flex flex-col gap-3 py-4"
                >
                  <Link href={`tel:${phoneNumber}`}>
                    <Phone className="h-8 w-8" />
                    <span className="text-sm">{phoneNumber}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {linkedin && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-auto flex flex-col gap-3 py-4"
                >
                  <Link href={linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-8 w-8" />
                    <span className="text-sm">LinkedIn</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {x && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-auto flex flex-col gap-3 py-4"
                >
                  <Link href={x} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-8 w-8" />
                    <span className="text-sm">X (Twitter)</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
export default ContactSection;

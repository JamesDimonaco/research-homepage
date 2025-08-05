"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, FileText, Wrench, Menu, Briefcase, Mic, Newspaper, Database } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface ContentCounts {
  projects: number;
  conferences: number;
  publications: number;
  datasets: number;
  news: number;
  tools: number;
}

interface HeaderProps {
  contentCounts: ContentCounts;
}

const Header = ({ contentCounts }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const allNavItems = [
    { href: "/", label: "Home", icon: Home, key: "home", alwaysShow: true },
    { href: "/projects", label: "Projects", icon: Briefcase, key: "projects" },
    { href: "/conferences", label: "Talks", icon: Mic, key: "conferences" },
    { href: "/publications", label: "Publications", icon: FileText, key: "publications" },
    { href: "/datasets", label: "Data", icon: Database, key: "datasets" },
    { href: "/news", label: "News", icon: Newspaper, key: "news" },
    { href: "/tools", label: "Tools", icon: Wrench, key: "tools" },
  ];

  // Filter nav items based on content counts
  const navItems = allNavItems.filter(item => 
    item.alwaysShow || contentCounts[item.key as keyof ContentCounts] > 0
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-xl font-bold hover:text-primary-dark transition-colors"
          >
            Dr. Nicholas Dimonaco
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2 pr-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-primary-dark transition-colors py-2"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

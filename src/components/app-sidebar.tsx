import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  Search,
  Users,
  BookOpen,
  Clock,
  Library,
  Sparkles,
  Mail,
  Info,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isTopLevel: true,
    },
    {
      title: "Follows",
      url: "#",
      icon: Heart,
      items: [
        {
          title: "Updates",
          url: "#",
          icon: Clock,
        },
        {
          title: "Library",
          url: "#",
          icon: Library,
        },
        {
          title: "Reading History",
          url: "#",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Titles",
      url: "#",
      icon: Search,
      items: [
        {
          title: "Advanced Search",
          url: "#",
          icon: Search,
        },
        {
          title: "Latest Updates",
          url: "#",
          icon: Clock,
        },
        {
          title: "AI Searching",
          url: "#",
          icon: Sparkles,
        },
      ],
    },
    {
      title: "Our Team",
      url: "#",
      icon: Users,
      items: [
        {
          title: "About Us",
          url: "#",
          icon: Info,
        },
        {
          title: "Contact",
          url: "#",
          icon: Mail,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="block">
          <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent transition-colors rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Manga Web</span>
              <span className="truncate text-xs text-muted-foreground">
                Manga Reader Platform
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Map through navigation items */}
        {data.navMain.map((item, index) => {
          if (item.isTopLevel) {
            return (
              <React.Fragment key={item.title}>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        {/* Special Homepage Button */}
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="flex items-center gap-2 rounded-lg py-4 font-bold text-lg"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                {/* Separator sau Homepage */}
                <Separator className="my-2" />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={item.title}>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <a
                            href={subItem.url}
                            className="flex items-center gap-2"
                          >
                            <subItem.icon className="h-4 w-4" />
                            {subItem.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {index < data.navMain.length - 1 &&
                !data.navMain[index + 1]?.isTopLevel && (
                  <Separator className="my-2" />
                )}
            </React.Fragment>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

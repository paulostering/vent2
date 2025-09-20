"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "ERP/CRM System",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Main Organization",
      logo: AudioWaveform,
      plan: "Professional",
    },
    {
      name: "Demo Environment",
      logo: Command,
      plan: "Development",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
        {
          title: "Reports",
          url: "/admin/reports",
        },
      ],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: Bot,
      items: [
        {
          title: "All Orders",
          url: "/admin/orders",
        },
        {
          title: "Pending",
          url: "/admin/orders/pending",
        },
        {
          title: "Completed",
          url: "/admin/orders/completed",
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: BookOpen,
      items: [
        {
          title: "All Customers",
          url: "/admin/customers",
        },
        {
          title: "Active",
          url: "/admin/customers/active",
        },
        {
          title: "Inactive",
          url: "/admin/customers/inactive",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings",
        },
        {
          title: "Users",
          url: "/admin/settings/users",
        },
        {
          title: "Roles",
          url: "/admin/settings/roles",
        },
        {
          title: "Integrations",
          url: "/admin/settings/integrations",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Inventory Management",
      url: "/admin/inventory",
      icon: Frame,
    },
    {
      name: "Sales Analytics",
      url: "/admin/analytics/sales",
      icon: PieChart,
    },
    {
      name: "Warehouse Locations",
      url: "/admin/warehouse",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

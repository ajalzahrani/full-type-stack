import {
  Calendar,
  Home,
  Building,
  Search,
  Settings,
  PersonStanding,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const generalItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const patientManagementItems = [
  {
    title: "Patient Registration",
    url: "/patient-registration",
    icon: PersonStanding,
  },
];

const resourceManagementItems = [
  {
    title: "Resources",
    url: "/resources",
    icon: PersonStanding,
  },
  {
    title: "Facilities",
    url: "/facilities",
    icon: Building,
  },
];

const appointmentManagementItems = [
  {
    title: "Resource Availability",
    url: "/resource-availability",
    icon: Calendar,
  },
  {
    title: "Appointment Types",
    url: "/appointment-types",
    icon: PersonStanding,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem>
          <img src="../assets/logo.png" alt="Logo" />
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {generalItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Patient Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {patientManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>Patient Registration</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Appointment Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appointmentManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Resource Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

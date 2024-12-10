import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function ProtectedLayout() {
  // Check if user is authenticated (you'll need to implement this based on your auth system)
  //   const isAuthenticated = localStorage.getItem("token"); // Or however you store auth state

  //   if (!isAuthenticated) {
  //     return <Navigate to="/signin" />;
  //   }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <Outlet />
    </SidebarProvider>
  );
}

export default ProtectedLayout;

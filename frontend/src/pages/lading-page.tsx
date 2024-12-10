import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getTotalUsers } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

const LandingPage = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: getTotalUsers,
  });
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            Total Users: {isPending ? "..." : data}
            <p className="text-red-500 text-xs">{error?.message}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-center mb-4">Welcome to the app!</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;

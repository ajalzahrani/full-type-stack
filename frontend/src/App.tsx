import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/signin";
import Signup from "./pages/signup";

import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Link } from "react-router-dom";

const client = hc<ApiRoutes>("/");

export const api = client.api;

function App() {
  const [totalUsers, setTotalUsers] = useState(-1);

  useEffect(() => {
    async function fetchTotalUsers() {
      const res = await api.users.total.$get();
      const data = await res.json();
      setTotalUsers(data.total);
    }
    fetchTotalUsers();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex justify-center items-center h-screen">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Total Users: {totalUsers}</CardTitle>
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
        }
      />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

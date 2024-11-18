import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/routes";
import { Link } from "react-router-dom";

function Signin() {
  const [totalUsers, setTotalUsers] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    async function fetchTotalUsers() {
      const res = await api.users.total.$get();
      const data = await res.json();
      setTotalUsers(data.total);
    }
    fetchTotalUsers();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("submit");
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const res = await api.users.login.$post({
      json: {
        username,
        password,
      },
    });

    if (res.status === 200) {
      console.log(await res.json());
      setSuccess("Login successful");
    } else {
      setError(res.statusText);
    }
  };

  const handleClear = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account to continue.</CardDescription>
          <CardDescription>Total users: {totalUsers}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
            }}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="username" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button type="submit" form="login-form">
            Login
          </Button>
        </CardFooter>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </Card>
    </div>
  );
}

export default Signin;

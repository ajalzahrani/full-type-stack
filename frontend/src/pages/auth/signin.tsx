import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import SigninForm from "@/components/froms/signin-form";

function Signin() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button type="submit" form="login-form">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signin;

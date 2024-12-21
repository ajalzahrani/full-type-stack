import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SingupForm from "@/components/froms/singup-form";

function Signup() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Signup to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <SingupForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;

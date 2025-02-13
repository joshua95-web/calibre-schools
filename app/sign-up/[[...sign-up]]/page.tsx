import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-800">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}

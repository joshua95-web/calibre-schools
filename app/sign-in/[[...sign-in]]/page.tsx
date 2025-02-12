import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-800">
      <SignIn />
    </div>
  );
}

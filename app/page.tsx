import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1 className="text-6xl">Welcome to some random website</h1>
      </div>
      <div className="bg-sky-700 px-4 py-2 rounded-lg text-white text-6xl">
        <SignInButton />
      </div>
    </div>
  );
}

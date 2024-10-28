import { SignOutButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-sky-700 px-10 py-2 rounded-lg text-white text-6xl">
        <h1>Dashboard</h1>
      </div>
      <div className="bg-sky-700 px-3 py-1 rounded-lg text-white">
        <SignOutButton />
      </div>
    </div>
  );
}

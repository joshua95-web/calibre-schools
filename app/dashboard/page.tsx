import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (userId) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="bg-sky-700 px-10 py-2 rounded-lg text-white text-6xl">
          <h1>Dashboard</h1>
        </div>
        <div>
          <p className="text-2xl">Welcome to your dashboard</p>
        </div>
        <div className="bg-sky-700 px-3 py-2 rounded-lg text-white text-6xl">
          <SignOutButton />
        </div>
        <pre>{JSON.stringify(user, null, 2)}</pre>;
      </div>
    );
  }
}

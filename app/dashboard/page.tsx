import { Protect, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import DisplayUserOrgData from "../components/display-user-org-data";
import { sendEmail } from "../actions/sendEmail";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  sendEmail(user as User);

  if (userId) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Protect
          role="org:school_admin"
          fallback={
            <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <p className="bg-red-700 px-10 py-2 rounded-lg text-white text-6xl">
                You do not have permission to view this content
              </p>
              <div className="bg-sky-700 px-3 py-2 rounded-lg text-white text-6xl">
                <SignOutButton />
              </div>
            </div>
          }
        >
          <div className="bg-sky-700 px-10 py-2 rounded-lg text-white text-6xl">
            <h1>Dashboard</h1>
          </div>
          <div>
            <p className="text-2xl">(a bunch of data only teachers can see)</p>
          </div>
          <div className="bg-sky-700 px-3 py-2 rounded-lg text-white text-6xl">
            <SignOutButton />
          </div>
        </Protect>
        <pre>{JSON.stringify(user, null, 2)}</pre>;
        <DisplayUserOrgData user={user} />
      </div>
    );
  }
}

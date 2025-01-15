import { Protect, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
// import { getNeonSchoolData } from "../actions/getNeonSchoolData";
import { getMemberData } from "../actions/getMemberData";
import PostSignupForm from "../components/post-signup-form";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  const clerkId = user?.id;
  const emailAddress = user?.emailAddresses[0].emailAddress;
  const member: Member = user ? await getMemberData(emailAddress) : null;
  // const neonSchoolData = member ? await getNeonSchoolData(member) : null;
  // console.log(neonUser);
  // console.log("clerk id is", clerkId);

  // Check if neonUser exists and has first_name, last_name and school and, if not, fill out a form
  // include form data for creating an organisation as a school and adding that info to neon and clerk
  if (!member?.first_name && !member?.last_name) {
    // change this later to encompass all required fields
    return (
      <div>
        <PostSignupForm
          member={member}
          clerkId={clerkId}
          // neonSchoolData={neonSchoolData}
        />
        <div>
          Clerk data
          <pre>{JSON.stringify(user, null, 2)}</pre>;
        </div>
        <div>
          Neon data
          <pre>{JSON.stringify(member, null, 2)}</pre>
        </div>
      </div>
    );
  }

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
        <div>
          Clerk data
          <pre>{JSON.stringify(user, null, 2)}</pre>;
        </div>
        <div>
          Neon data
          <pre>{JSON.stringify(member, null, 2)}</pre>
        </div>
        <div>
          Member info
          <pre>{JSON.stringify(member, null, 2)}</pre>
        </div>
        <div>
          Neon School Data
          <pre>{JSON.stringify(neonSchoolData, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

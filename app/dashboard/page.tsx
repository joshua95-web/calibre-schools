import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getNeonSchoolData } from "../actions/getNeonSchoolData";
import { getMemberData } from "../actions/getMemberData";
import PostSignupForm from "../components/post-signup-form";

export default async function SchoolAdminDashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  const clerkId = user?.id;
  const emailAddress = user?.emailAddresses[0].emailAddress;
  const member: Member = user ? await getMemberData(emailAddress) : null;
  const neonSchoolData = member ? await getNeonSchoolData(emailAddress) : null;

  if (
    (!member[0].first_name && !member[0].last_name) ||
    neonSchoolData.length === 0
  ) {
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

  // page protection
  const isSchoolAdmin = await checkRole("school_admin");
  if (!isSchoolAdmin) {
    redirect("/");
  }

  return (
    <div>
      <div>
        <div className="bg-orange-500 font-extrabold flex justify-center text-2xl mx-80 px-9 py-3 rounded-3xl">
          <p>
            This is the protected school admin dashboard. You can see this
            because you have the school_admin role.
          </p>
        </div>
      </div>
      <div className="flex justify-center py-10">
        <div className="bg-fuchsia-700 px-2 py-2 rounded-3xl text-white font-semibold">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

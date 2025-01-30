import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getNeonSchoolData } from "../actions/getNeonSchoolData";
import { getMemberData } from "../actions/getMemberData";
import PostSignupForm from "../components/post-signup-form";
import { UserButton } from "@clerk/nextjs";
import StudentManager from "../components/student-manager";

export default async function SchoolAdminDashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  const clerkId = user?.id;
  const emailAddress = user?.emailAddresses[0].emailAddress;
  const member = user ? await getMemberData(emailAddress) : null;
  const teacherMemberId = member?.[0]?.mem_number ?? null;
  const neonSchoolData = member ? await getNeonSchoolData(emailAddress) : null;
  const school_id = neonSchoolData?.[0]?.school_id ?? null;

  if (
    (!member[0].first_name && !member[0].last_name) ||
    neonSchoolData?.length === 0
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
  const isAdmin = await checkRole("org:admin");
  if (!isAdmin) {
    redirect("/");
  }
  console.log("teacherMemberId:", teacherMemberId, "schoolId:", school_id);
  return (
    <div>
      <div>
        <div className="flex justify-left">
          <div className="bg-amber-500 rounded-r-full p-2">
            <UserButton showName={true} appearance={{}} />
          </div>
        </div>
        <div className="bg-red-500 font-extrabold flex justify-center text-2xl mx-80 px-9 py-3 rounded-3xl">
          <p>
            This is the protected school admin dashboard. You can see this
            because you have the school_admin role.
          </p>
        </div>
        <div>
          <div className="m-2">
            {/* make a pupil list component and an add-pupil component for here */}
            <StudentManager
              teacherMemberId={teacherMemberId}
              schoolId={school_id}
            />
            {/* <div className="bg-slate-600 text-white mx-80 py-2 px-3"></div> */}
          </div>
        </div>
      </div>
      <div className="flex justify-left py-10">
        <div className="bg-fuchsia-700 px-2 py-2 rounded-3xl text-white font-semibold">
          <SignOutButton />
        </div>
      </div>
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

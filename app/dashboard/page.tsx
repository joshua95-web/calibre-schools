import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getNeonSchoolData } from "../actions/getNeonSchoolData";
import { getMemberData } from "../actions/getMemberData";
import PostSignupForm from "../components/post-signup-form";
import { UserButton } from "@clerk/nextjs";
import StudentManager from "../components/student-manager";
import Navbar from "../components/navbar";

export default async function SchoolAdminDashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  const clerkId = user?.id;
  const emailAddress = user?.emailAddresses[0].emailAddress;
  const member = user ? await getMemberData(emailAddress) : null;
  const teacherMemberNumber = member?.[0]?.mem_number ?? null;
  const teacherMemberId = member?.[0]?.id ?? null;
  const neonSchoolData = member ? await getNeonSchoolData(emailAddress) : null;
  const schoolName = neonSchoolData?.[0]?.establishment_name;
  const school_id = neonSchoolData?.[0]?.school_id ?? null;
  const staffId = neonSchoolData?.[0]?.staff_id ?? null;

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
  const isSchoolAdmin = await checkRole("school_admin");
  if (!isSchoolAdmin) {
    redirect("/");
  }
  console.log(
    "teacherMemberNumber:",
    teacherMemberNumber,
    "teacherMemberId",
    teacherMemberId,
    "schoolId:",
    school_id
  );
  return (
    <div>
      <div className="mb-10">
        <Navbar memberNumber={teacherMemberNumber} schoolName={schoolName} />
      </div>
      <div>
        <div className="flex justify-left"></div>
        {/* <div className="bg-red-500 font-extrabold flex justify-center text-2xl mx-80 px-9 py-3 rounded-3xl">
          <p>
            This is the protected school admin dashboard. You can see this
            because you have the school_admin role.
          </p>
        </div> */}
        <div>
          <div className="m-2">
            <StudentManager
              teacherMemberId={teacherMemberId}
              teacherMemberNumber={teacherMemberNumber}
              staffId={staffId}
              schoolId={school_id}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-left py-10"></div>

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

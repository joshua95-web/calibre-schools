"use client";
import { useEffect, useState } from "react";
import { SignOutButton, useOrganizationList } from "@clerk/nextjs";
import TextReadInput from "./text-read-input";
import { sendSchoolData } from "../actions/sendSchoolData";
import { sendMemberData } from "../actions/sendMemberData";
import { useUser } from "@clerk/nextjs";
import { setSchoolAdmin } from "../actions/setSchoolAdmin";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PostSignupFormProps {
  member: [
    {
      first_name?: string;
      last_name?: string;
      prefix?: string;
      mobile?: string;
    }
  ];

  neonSchoolData?: NeonSchoolData;
}

export default function PostSignupForm({
  member,
  neonSchoolData,
}: PostSignupFormProps) {
  const [formData, setFormData] = useState({
    first_name: member[0]?.first_name ?? "",
    last_name: member[0]?.last_name ?? "",
    prefix: member[0]?.prefix ?? "",
    mobile: member[0]?.mobile ?? "",
    school: "", // This is a string to store the school name
    schoolData: null as schoolImport | null,
  });

  const router = useRouter();

  // SCHOOL SEARCH

  const [showSchoolResults, setShowSchoolResults] = useState(false);

  const handleCancelSearchClick = () => {
    setFormData({
      ...formData,
      school: "",
      schoolData: null,
    });
    setShowSchoolResults(false);
  };

  const [schools, setSchools] = useState<schoolImport[]>([]);

  useEffect(() => {
    async function fetchSchools() {
      const response = await fetch("/data/schooldata20220930.json");
      const data = await response.json();
      const parsedData = data.map((school: schoolImport) => ({
        ...school,
        Id: Number(school.Id),
      }));
      setSchools(parsedData);
    }
    fetchSchools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "school") {
      setShowSchoolResults(true);
    }
  };

  const handleSchoolSelection = (school: schoolImport) => {
    setFormData((prev) => ({
      ...prev,
      school: school.establishmentName,
      schoolData: school,
    }));

    setShowSchoolResults(false);
  };

  // CLERK STUFF

  // const clientUsers = await client.users

  const { isLoaded, isSignedIn, user } = useUser();

  const { createOrganization } = useOrganizationList();

  if (!isLoaded || !isSignedIn || !user) {
    return <div>Loading...</div>;
  }

  const email = user?.emailAddresses[0]?.emailAddress ?? "No email";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendMemberData(email, formData);

      if (!formData.schoolData || !formData.schoolData.establishmentName) {
        throw new Error("School data is missing");
      }

      const newOrg = await createOrganization({
        name: formData.schoolData?.establishmentName || "Default Org Name",
      });

      console.log("Clerk org created!", newOrg);

      // Ensure the role is updated in Clerk
      const adminUpdateResponse = await setSchoolAdmin(user.id);
      if (!adminUpdateResponse.success) {
        console.error(
          "Failed to update user metadata:",
          adminUpdateResponse.error
        );
      }

      await sendSchoolData(email, formData);
      console.log("School data sent to Neon");

      if (
        member[0]?.first_name &&
        member[0]?.last_name &&
        neonSchoolData?.establishmentName
      ) {
        router.push(`/dashboard`);
      } else {
        console.log("Data missing!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (member) {
    return (
      <main className="mx-6 -mt-16 min-h-full max-w-6xl md:mx-8 lg:mx-auto 2xl:max-w-8xl">
        <div className="text-3xl text-slate-800 dark:text-slate-200 font-semibold flex justify-center items-center min-h-screen">
          <div className="my-8 flex flex-col space-y-12">
            <div className="flex flex-col space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800 lg:text-5xl dark:text-slate-100 mt-20">
                We just need a bit more information
              </h2>
            </div>
            <form className="bg-white shadow-2xl p-4 rounded-3xl">
              <div className="flex justify-center m-4 p-4">
                <Image
                  src="/branding/learning-icon-orange.svg"
                  alt="Calibre Learning Logo"
                  width={80}
                  height={80}
                  className="h-20 w-auto"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <TextReadInput
                    label="Prefix"
                    type="text"
                    name="prefix"
                    value={member[0]?.prefix || formData?.prefix}
                    placeholder="Prefix"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <TextReadInput
                    label="First Name"
                    type="text"
                    name="first_name"
                    value={member[0]?.first_name || formData?.first_name}
                    placeholder="First Name"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <TextReadInput
                    label="Last Name"
                    type="text"
                    name="last_name"
                    value={member[0]?.last_name || formData?.last_name}
                    placeholder="Last Name"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <TextReadInput
                    label="Mobile"
                    type="text"
                    name="mobile"
                    value={member[0]?.mobile || formData?.mobile}
                    placeholder="Mobile"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div className="mt-4 px-4 py-2">
                  <TextReadInput
                    label="School"
                    type="text"
                    name="school"
                    value={formData?.school}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div>
              </div>

              {/* This bit only shows the dropdown if the showSchoolResults state is true */}

              {showSchoolResults && formData.school.length > 0 && (
                <div>
                  <ul className="border-slate-300 text-sm bg-slate-50 dark:text-slate-800 mt-2">
                    {schools
                      .filter((school) =>
                        school.establishmentName
                          .toLowerCase()
                          .includes(formData.school.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((school) => (
                        <li
                          key={school.Id}
                          onClick={() => handleSchoolSelection(school)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {school.establishmentName} - {school.town}
                        </li>
                      ))}
                  </ul>

                  <button
                    className="bg-red-600 text-lg text-white px-3 py-2 rounded-full mt-3 m-2"
                    onClick={handleCancelSearchClick}
                  >
                    Cancel Input
                  </button>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-calibre-citrus text-2xl text-white px-3 py-2 rounded-full mt-3 m-2"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <SignOutButton />
        </div>
        Neon data
        <pre>{JSON.stringify(member, null, 2)}</pre>
        <div>
          Clerk data
          <pre>{JSON.stringify(user, null, 2)}</pre>;
        </div>
        <div>
          Full form data
          <pre>{JSON.stringify(formData, null, 2)}</pre>;
        </div>
        <div>
          Member info
          <pre>{JSON.stringify(member, null, 2)}</pre>
        </div>
        <div>
          Neon School Data
          <pre>{JSON.stringify(neonSchoolData, null, 2)}</pre>
        </div>
      </main>
    );
  }
}

"use client";
import { useEffect, useState } from "react";
import { SignOutButton, useOrganizationList } from "@clerk/nextjs";
import TextReadInput from "./text-read-input";
import { sendSchoolData } from "../actions/sendSchoolData";
import { sendMemberData } from "../actions/sendMemberData";
import { auth, clerkClient } from "@clerk/nextjs/server";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendMemberData(email, formData);
    if (!formData.schoolData || !formData.schoolData.establishmentName) {
      throw new Error("School data is missing");
    } else {
      try {
        const newOrg = createOrganization({
          name: formData.schoolData?.establishmentName || "Default Org Name",
        });
        setSchoolAdmin();
        console.log("Clerk org created!", newOrg);
      } catch (error) {
        console.error("Clerk org creation failed", error);
      }
      try {
        sendSchoolData(email, formData);
        console.log("School data sent to Neon");
      } catch (error) {
        console.error("School data failed to send to Neon", error);
      }
    }
    if (
      member[0]?.first_name &&
      member[0]?.last_name &&
      neonSchoolData?.establishmentName
    ) {
      router.push(`/dashboard`);
    } else {
      console.log("Data missing!");
    }
  };

  if (member) {
    return (
      <div>
        <div className=" text-3xl text-black font-semibold ">
          <div className="flex justify-center">
            <div className="flex-end">
              <div className="flex flex-col">
                <form className="bg-white shadow-2xl p-4 rounded-3xl">
                  <h1 className="text-slate-900 px-6">
                    We need some more information...
                  </h1>
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
                      <ul className="border-slate-300 text-sm bg-slate-50 mt-2">
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
          </div>
          <div className="flex justify-between"></div>
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
      </div>
    );
  }
}

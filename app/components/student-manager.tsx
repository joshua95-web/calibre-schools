"use client";
import { useState } from "react";
import TextReadInput from "./text-read-input";

interface StudentManagerProps {
  teacherMemberId: string;
  schoolId: string;
}

export default function StudentManager({
  teacherMemberId,
  schoolId,
}: StudentManagerProps) {
  const [formData, setFormData] = useState({
    // member data for the student retrieved via member_school table, drill
    // this down from dashboard when retrieved from getStudents() action
    // create and insert member number the same way but via the
    // addStudent() action
    student_first_name:
      // student?.first_name ??
      "",
    student_last_name:
      //student?.last_name ??
      "",
  });

  console.log(
    "I'm a console log inside the student manager component. This user's schoolID is ",
    schoolId
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(
      "addStudent server action will be initiated using the following data: ",
      formData
    );
  };

  if (teacherMemberId) {
    return (
      <div>
        <div className="text-3xl text-black font-extrabold">
          <h1>Your Students</h1>
          <p className="text-">No students yet...</p>
          <h1>Add a Student...</h1>
          {/* hide this form until they click 
          a big plus button */}
          <form className=" flex justify-left relative mt-4 space-x-10 divide-x divide-slate-200 px-4 sm:px-11">
            <div className="space-y-3 px-4">
              <TextReadInput
                label="Student First Name"
                type="text"
                name="student_first_name"
                value={formData?.student_first_name}
                placeholder="Student First Name"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-3 px-4">
              <TextReadInput
                label="Student Last Name"
                type="text"
                name="student_last_name"
                value={formData?.student_last_name}
                placeholder="Student Last Name"
                onChange={handleChange}
              />
            </div>
            {/* cancel add button that
            hides this section again and
            erases formData */}
            <div className="px-4 py-2">
              <button
                type="submit"
                className="bg-amber-500 text-lg text-white px-3 py-2 rounded mt-3 m-2"
                onClick={handleSubmit}
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

"use client";
import { useState } from "react";
import TextReadInput from "./text-read-input";

interface StudentManagerProps {
  teacherMemberId: string;
}

export default function StudentManager({
  teacherMemberId,
}: StudentManagerProps) {
  const [formData, setFormData] = useState({
    // member data for the student retrieved via member_school table, drill
    // this down from dashboard when retrieved from getStudents() action
    // create and insert member number the same way but via the
    // addStudent() action
    studentFirstName:
      // student?.firstname ??
      "",
    studentLastName:
      //student?.last_name ??
      "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (teacherMemberId) {
    return (
      <div>
        <div className="text-3xl text-black font-extrabold">
          <h1>Your Students</h1>
          <div></div>
          <form>
            <TextReadInput label="" />
          </form>
        </div>
      </div>
    );
  }
}

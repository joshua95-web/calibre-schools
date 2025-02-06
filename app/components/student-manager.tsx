"use client";
import { useState } from "react";
import TextReadInput from "./text-read-input";
import { FaPlusCircle } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

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
    student_date_of_birth: "",
  });

  // school year and age stuff

  // school year to lower bound age (maybe higher one for turning 18? Or not?)
  // const schoolYearToAge: Record<string, number> = {
  //   Reception: 4,
  //   "Year 1": 5,
  //   "Year 2": 6,
  //   "Year 3": 7,
  //   "Year 4": 8,
  //   "Year 5": 9,
  //   "Year 6": 10,
  //   "Year 7": 11,
  //   "Year 8": 12,
  //   "Year 9": 13,
  //   "Year 10": 14,
  //   "Year 11": 15,
  //   "Year 12": 16,
  //   "Year 13": 17,
  // };

  // const handleSchoolYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const school_year = e.target.value;

  //   const age = schoolYearToAge[school_year];
  //   if (age) {
  //     const currentYear = new Date().getFullYear();

  //     const birthYear = currentYear - age;

  //     const approximate_dob = `${birthYear}-00-00`;
  //     setFormData((prev) => ({
  //       ...prev,
  //       school_year: "",
  //       approximate_dob: "",
  //     }));
  //   }
  // };

  console.log(
    "I'm a console log inside the student manager component. This user's schoolID is ",
    schoolId
  );

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format("YYYY/MM/DD");
      setFormData((prev) => ({
        ...prev,
        student_date_of_birth: formattedDate,
      }));
      console.log("Selected Date:", formattedDate);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelInputClick = () => {
    setFormData({
      ...formData,
      student_first_name: "",
      student_last_name: "",
      student_date_of_birth: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // check all fields are complete and print message if not

    // addStudent(teacherMemberId, schoolId, formData)

    console.log(
      "addStudent server action will be initiated using the following data: ",
      formData
    );
  };

  const [isHidden, setIsHidden] = useState(true);

  const ToggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  if (teacherMemberId) {
    return (
      <div className="flex justify-center">
        <div className="text-3xl text-slate-800 font-sans bg-white shadow-2xl p-4 rounded-md">
          <div className="flex justify-center">
            <h1>Your Students</h1>
          </div>
          <div className="flex justify-center">
            <p className="text-lg p-3 text-slate-600">No students yet...</p>
          </div>
          <div className="flex flex-col">
            {/* hide this form until they click 
          a big plus button */}
            <div className="flex justify-center mt-5  text-white text-lg font-semibold">
              <button
                className=" bg-slate-600 w-40 h-20 rounded-full"
                onClick={ToggleVisibility}
              >
                <div className="flex justify-center m-1">Add a Student...</div>
                <div className="flex justify-center">
                  <FaPlusCircle size={30} color="white" />
                </div>
              </button>
            </div>
            <div
              className={`${
                isHidden
                  ? "max-h-0 overflow-hidden"
                  : "max-h-[1000px] overflow-auto"
              } transition-all duration-500 ease-in-out`}
            >
              <form className="grid grid-cols-1 relative mt-4 divide-slate-200 px-4 sm:px-11">
                <div className="flex justify-center">
                  <div className="space-y-3 max-w-sm px-4">
                    <TextReadInput
                      label="Student First Name"
                      type="text"
                      name="student_first_name"
                      value={formData?.student_first_name}
                      placeholder="Student First Name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-3 max-w-sm px-4">
                    <TextReadInput
                      label="Student Last Name"
                      type="text"
                      name="student_last_name"
                      value={formData?.student_last_name}
                      placeholder="Student Last Name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-3 max-w-sm px-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Select Date of Birth"
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="flex w-80 px-4 py-1">
                    <button
                      type="submit"
                      className="bg-amber-500 text-lg text-white px-3 py-2 rounded-lg mt-3 m-2"
                      onClick={handleSubmit}
                    >
                      Add Student
                    </button>
                    <div className="flex justify-end">
                      <button
                        className="bg-slate-500 text-lg text-white px-3 py-2 rounded-lg mt-3 m-2"
                        onClick={handleCancelInputClick}
                      >
                        Cancel Input
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div>
                Full form data
                <pre>{JSON.stringify(formData, null, 2)}</pre>;
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    console.error(
      "teacherMemberId is not found. Currently, teacherMemberId returns: ",
      teacherMemberId
    );
    <div className="bg-red-700 text-lg">
      No member ID found for current user...
    </div>;
  }
}

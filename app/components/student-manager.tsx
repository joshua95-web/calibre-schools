"use client";
import { useEffect, useState } from "react";
import TextReadInput from "./text-read-input";
import { FaPlusCircle } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { addStudent } from "../actions/addStudents";
import { getStudent } from "../actions/getStudents";
import { deleteStudent } from "../actions/deleteStudent";
import { ImBin } from "react-icons/im";

interface studentList {
  mem_number: string;
  first_name: string;
  last_name: string;
}

interface StudentManagerProps {
  teacherMemberNumber: string;
  teacherMemberId: string;
  schoolId: string;
  staffId: string;
}

export default function StudentManager({
  teacherMemberNumber,
  teacherMemberId,
  schoolId,
  staffId,
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

  console.log(
    "I'm a console log inside the student manager component. This user's schoolID is ",
    schoolId,
    "the teacherMemberNumber is ",
    teacherMemberNumber,
    "and the teacherMemberId is ",
    teacherMemberId
  );

  const [studentList, setStudentList] = useState<studentList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students = await getStudent(schoolId, teacherMemberId);
        setStudentList(students);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [schoolId, teacherMemberId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addStudent(staffId, schoolId, formData);
      console.log("Student added successfully");

      setFormData({
        ...formData,
        student_first_name: "",
        student_last_name: "",
        student_date_of_birth: "",
      });

      console.log("formData has been cleared");
    } catch (error: unknown) {
      return { ok: false, error: error as Error };
    }
  };

  const [isHidden, setIsHidden] = useState(true);

  const ToggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  // deleting a student

  const [selectedStudent, setSelectedStudent] = useState<studentList | null>(
    null
  );

  const [confirmDelete, setConfirmDelete] = useState(false);

  const cancelConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const handleConfirmDelete = (student: studentList) => {
    setSelectedStudent(student);
    setConfirmDelete(true);
  };

  const handleDeleteStudent = async (student) => {
    const memberNumber = student?.mem_number;
    await deleteStudent(memberNumber);
  };

  console.log("Main Contact ID: ", staffId);

  if (teacherMemberNumber) {
    return (
      <div className="flex justify-center">
        {confirmDelete && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            // Optional: close modal when clicking outside the content
            onClick={cancelConfirmDelete}
          >
            <div
              className="bg-slate-100 p-6 rounded-md shadow-lg"
              // Prevent clicks inside the modal from closing it
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl text-slate-800 font-sans bg-slate-100">
                <h1 className="flex justify-center mt-2 mb-6">
                  Are you sure you want to delete this student?
                </h1>
              </div>
              <div className="flex gap-2 justify-center p-5 mb-6 text-lg text-slate-800">
                <p>{selectedStudent?.first_name}</p>
                <p>{selectedStudent?.last_name}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <div>
                  <button
                    onClick={handleDeleteStudent}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete Student
                  </button>
                </div>
                <div>
                  <button
                    onClick={cancelConfirmDelete}
                    className="bg-slate-600 hover:bg-slate-800 text-white px-4 py-2 rounded"
                  >
                    No, cancel!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`content ${confirmDelete ? "blurred" : ""}`}>
          <div className="text-3xl text-slate-800 font-sans bg-white shadow-2xl p-4 rounded-md">
            <div className="flex justify-center mt-2 mb-6">
              <h1>Your Students</h1>
            </div>
            {!studentList ? (
              <div className="flex justify-center">
                <p className="text-lg p-3 text-slate-600">No students yet...</p>
              </div>
            ) : (
              <div className="block text-sm font-semibold text-slate-900 mb-4">
                {/* <div>
                Students
                <pre>{JSON.stringify(studentList, null, 2)}</pre>;
              </div> */}
                <div>
                  <div className="grid grid-cols-4 font-semibold text-slate-700 border-b pb-2">
                    <div>First Name</div>
                    <div>Last Name</div>
                    <div>Member Number</div>
                  </div>
                  <ul>
                    {studentList.map((student) => (
                      <li key={student.mem_number}>
                        <div className="grid grid-cols-4 my-3">
                          <div>{student.first_name} </div>{" "}
                          <div>{student.last_name} </div>
                          <div>{student.mem_number} </div>{" "}
                          <button onClick={() => handleConfirmDelete(student)}>
                            <ImBin size={15} style={{ color: "#c82300" }} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex flex-col">
              {/* hide this form until they click 
          a big plus button */}
              <div className="flex justify-center mt-5  text-white text-lg font-semibold">
                <button
                  className=" bg-slate-600 w-40 h-20 rounded-full"
                  onClick={ToggleVisibility}
                >
                  <div className="flex justify-center m-1">
                    Add a Student...
                  </div>
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
                    <div className="max-w-sm px-4">
                      <div className="block text-sm font-semibold text-slate-900 mb-4">
                        <p>Student&apos;s Date of Birth</p>
                      </div>
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
                  {/* <div>
                  Full form data
                  <pre>{JSON.stringify(formData, null, 2)}</pre>;
                </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    console.error(
      "teacherMemberNumber is not found. Currently, teacherMemberNumber returns: ",
      teacherMemberNumber
    );
    <div className="bg-red-700 text-lg">
      No member ID found for current user...
    </div>;
  }
}

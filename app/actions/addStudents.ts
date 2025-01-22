"use server";

import { neon } from "@neondatabase/serverless";
import { Snowflake } from "@theinternetfolks/snowflake";

interface StudentData {
  student_first_name: string;
  student_last_name: string;
}

export async function addStudent(
  teacherMemberId: string,
  formData: StudentData
) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const student_first_name = formData.student_first_name;
  const student_last_name = formData.student_last_name;
}

try {
    const addStudentResult = await sql `
    
    `
}

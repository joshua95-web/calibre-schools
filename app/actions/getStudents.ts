"use server";

import { neon } from "@neondatabase/serverless";

export async function getStudent(schoolId: string, teacherMemberId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const studentData = await sql`
    SELECT
      m.id,
      m.mem_number,
      m.first_name,
      m.last_name
    FROM member m
    JOIN member_school ms ON m.id = ms.member_id
    WHERE ms.school_id = ${schoolId}
    AND ms.member_id != ${teacherMemberId}; -- don't want teachers in this action
    `;
  return studentData;
}

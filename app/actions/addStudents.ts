"use server";

import { neon } from "@neondatabase/serverless";
import { Snowflake } from "@theinternetfolks/snowflake";

interface StudentData {
  student_first_name: string;
  student_last_name: string;
  student_date_of_birth: string;
}

export async function addStudent(
  staffId: string,
  schoolId: string,
  formData: StudentData
) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const student_first_name = formData.student_first_name;
  const student_last_name = formData.student_last_name;
  const memberId = Snowflake.generate({ timestamp: Date.now() });
  console.log("Member ID is", memberId);
  const student_date_of_birth = formData.student_date_of_birth;

  const existingStudent = await sql`
    SELECT first_name, last_name, date_of_birth
    FROM member
    WHERE first_name = ${student_first_name}
    AND last_name = ${student_last_name}
    AND date_of_birth = ${student_date_of_birth}
    LIMIT 1;
    `;

  // member number creation

  const maxMemNumberResult = await sql`
SELECT MAX("mem_number") AS max_mem_number FROM "member"
`;

  const maxMemNumber = maxMemNumberResult[0]?.max_mem_number || 0;
  const newMemNumber = maxMemNumber + 1;

  if (existingStudent.length > 0) {
    throw new Error(
      "A student already exists with this full name and date of birth."
    );
  } else
    try {
      await sql`

INSERT INTO "member" ("id", "mem_number", "first_name", "last_name", "date_of_birth")
VALUES (${memberId}, ${newMemNumber}, ${student_first_name}, ${student_last_name}, ${student_date_of_birth})

`;
      await sql`
  INSERT INTO member_school (
    member_id, 
    school_id, 
    main_contact_id
  )
  VALUES (
    ${memberId}, 
    ${schoolId}, 
    ${staffId}
  )
`;
    } catch (error) {
      console.error("Error adding student: ", error);
    }
}

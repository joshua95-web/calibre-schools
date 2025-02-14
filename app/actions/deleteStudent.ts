"use server";

import { neon } from "@neondatabase/serverless";

export async function deleteStudent(memberNumber) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  try {
    const checkMember = await sql`
        SELECT m.id FROM member m
        JOIN member_school ms ON m.id = ms.member_id
        WHERE m.mem_number = ${memberNumber}
    `;

    if (checkMember.length === 0) {
      throw new Error(
        "Member does not exist in member_school table or they do not exist at all."
      );
    }
    // delete member and their school record will be deleted because of cascade
    await sql`
        DELETE FROM member
        WHERE id = ${checkMember[0].id}
    `;

    return { success: true, message: "Student deleted successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

"use server";

import { neon } from "@neondatabase/serverless";

interface MemberData {
  first_name: string;
  last_name: string;
  prefix: string;
  mobile: string;
}

export async function sendMemberData(email: string, formData: MemberData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const first_name = formData.first_name;
  const last_name = formData.last_name;
  const prefix = formData.prefix;
  const mobile = formData.mobile;

  try {
    const updateMemberResult = await sql`
    UPDATE "member"
    SET
    prefix = ${prefix},
    first_name = ${first_name},
    last_name = ${last_name},
    mobile = ${mobile}
    WHERE email = ${email}
    `;
    if (updateMemberResult) {
      console.log("Member updated successfully");
    }
  } catch (error) {
    console.error("Error updating member:", error);
  }
}

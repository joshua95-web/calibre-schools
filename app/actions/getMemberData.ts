"use server";

import { neon } from "@neondatabase/serverless";

export async function getMemberData(emailAddress: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const memberData = await sql`
    SELECT
    mem_number
    FROM "member" 
    WHERE "email" = ${emailAddress}
    `;

  const memberId = memberData.length > 0 ? memberData[0].id : null;

  return memberData;
  return memberId;
}

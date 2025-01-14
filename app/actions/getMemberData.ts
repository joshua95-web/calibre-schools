"use server";

import { neon } from "@neondatabase/serverless";

export async function getMemberData(clerkId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  console.log("clerkId is", clerkId);

  const memberData = await sql`
    SELECT
    id,
    mem_number
    FROM "member" 
    WHERE "clerk_user_id" = ${clerkId}
    `;

  const memberId = memberData.length > 0 ? memberData[0].id : null;

  return memberData;
  return memberId;
}

"use server";

import { neon } from "@neondatabase/serverless";

export async function getMemberData(neonUser: neonUser) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const memberData = await sql`
    SELECT
    id,
    caluser_id
    FROM "member" 
    WHERE "caluser_id" = ${neonUser[0].id}
    `;

  const memberId = memberData.length > 0 ? memberData[0].id : null;

  return memberData;
  return memberId;
}

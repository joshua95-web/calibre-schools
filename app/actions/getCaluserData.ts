"use server";

import { neon } from "@neondatabase/serverless";

export async function getCaluserData(clerkId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const caluserData = await sql`
  SELECT 
  id,
  email,
  first_name,
  last_name,
  prefix,
  suffix,
  mobile,
  telephone,
  created_at,
  updated_at,
  user_role,
  email_verified,
  avatar,
  clerk_user_id
  FROM "caluser" WHERE "clerk_user_id" = ${clerkId} LIMIT 1
  `;

  return caluserData;
}

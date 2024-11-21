"use server";
import { User } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function sendClerkData(neonUser: neonUser) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const calUserId = neonUser.id;
  const first_name = neonUser.first_name;
  const last_name = neonUser.last_name;
  const prefix = neonUser.prefix;
  const suffix = neonUser.suffix;
  const mobile = neonUser.mobile;
  const telephone = neonUser.telephone;

  const sendClerkDataResult = await sql`
 UPDATE "caluser"

  `;

  return sendClerkDataResult;
}

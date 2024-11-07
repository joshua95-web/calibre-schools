"use server";
import { User } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function sendClerkData(user: User) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const clerkId = user.id;
  const emailAddress = user.emailAddresses[0].emailAddress;
  const createdAtEpoch = user.createdAt;
  const createdAt = new Date(createdAtEpoch).toISOString();
  const updatedAtEpoch = user.updatedAt;
  const updatedAt = new Date(updatedAtEpoch).toISOString();

  // Check they don't exist already otherwise don't send:

  const existingUser = await sql`
  SELECT 1 FROM "teacher" WHERE "clerk_id" = ${clerkId} LIMIT 1
  `;

  if (existingUser.length > 0) {
    console.log("User already exists in the database");
    return {
      message: "User already exists in the database, no insert performed",
    };
  }

  console.log("Email is", emailAddress);
  console.log("Clerk ID is", clerkId);

  const sendClerkDataResult = await sql`
  INSERT INTO "teacher"
  SET "clerk_id" = ${clerkId},
  "main_contact" = ${emailAddress},
  "created_at" = ${createdAt},
  "updated_at" = ${updatedAt}
  `;

  return sendClerkDataResult;
}

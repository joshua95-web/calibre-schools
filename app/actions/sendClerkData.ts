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
  const isVerified = user.emailAddresses[0].verification?.status === "verified";

  // Check they don't exist already otherwise don't send:

  const existingUser = await sql`
  SELECT 1 FROM "caluser" WHERE "clerk_user_id" = ${clerkId} LIMIT 1
  `;

  if (existingUser.length > 0) {
    console.log("User already exists in the database");
    return {
      message: "User already exists in the database, no insert performed",
    };
  }

  console.log("Email is", emailAddress);
  console.log("Clerk ID is", clerkId);
  console.log("Email is verified", isVerified);

  const sendClerkDataResult = await sql`
 INSERT INTO "caluser" ("email", "clerk_user_id", "created_at", "updated_at")
  VALUES (${emailAddress}, ${clerkId}, ${createdAt}, ${updatedAt})
  RETURNING id
  `;

  const calUserId = sendClerkDataResult[0].id;

  // member number creation

  const maxMemNumberResult = await sql`
  SELECT MAX("mem_number") AS max_mem_number FROM "member"
  `;

  const maxMemNumber = maxMemNumberResult[0]?.max_mem_number || 0;
  const newMemNumber = maxMemNumber + 1;

  const memberResult = await sql`
  
  INSERT INTO "member" ("caluser_id", "clerk_user_id", "created_at", "mem_number")
  VALUES (${calUserId}, ${clerkId}, ${createdAt}, ${newMemNumber})

  `;

  if (memberResult) {
    console.log("Member added successfully");
  }

  return { sendClerkDataResult, memberResult };
}

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

  // try ON CONFLICT and do something with that like update or ignore (check the API calibre for examples with creating users)

  const existingUser = await sql`
  SELECT 1 FROM "caluser" WHERE "clerk_user_id" = ${emailAddress} LIMIT 1
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
  `;

  return sendClerkDataResult;
}

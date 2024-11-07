"use server";

import { neon } from "@neondatabase/serverless";

export async function sendEmail(user: User) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const clerkId = user.id;
  const emailAddress = user.emailAddresses[0].emailAddress;

  console.log("Sending email to", emailAddress);
  console.log("Clerk ID is", clerkId);
}

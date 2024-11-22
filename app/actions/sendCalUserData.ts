"use server";

import { neon } from "@neondatabase/serverless";

export async function sendClerkData(neonUser: neonUser, formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const email = neonUser.email;
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const prefix = formData.get("prefix");
  const suffix = formData.get("suffix");
  const mobile = formData.get("mobile");
  const telephone = formData.get("telephone");

  try {
    const userRecord = await sql`
    SELECT id FROM "caluser" WHERE "email" = ${email} LIMIT 1;
    `;
    let userId = null;

    if (userRecord.length > 0) {
      userId = userRecord[0].id;
    } else {
      console.error("User not found:", userId);
    }

    const updateCaluserResult = await sql`
    UPDATE "caluser"
    SET
      prefix = ${prefix},
      first_name = ${first_name},
      last_name = ${last_name},
      suffix = ${suffix},
      mobile = ${mobile},
      telephone = ${telephone}
    WHERE id = ${userId}
  `;

    // Put the rest of the info to do with schools as you build it

    if (updateCaluserResult) {
      console.log("Caluser updated successfully");
    }
  } catch (error) {
    console.error("Error updating caluser:", error);
  }
}

"use server";

import { neon } from "@neondatabase/serverless";

interface FormData {
  first_name: string;
  last_name: string;
  prefix: string;
  suffix: string;
  mobile: string;
  telephone: string;
}

export async function sendCalUserData(neonUser: neonUser, formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);
  const email = neonUser[0]?.email;
  const first_name = formData.first_name;
  const last_name = formData.last_name;
  const prefix = formData.prefix;
  const suffix = formData.suffix;
  const mobile = formData.mobile;
  const telephone = formData.telephone;

  try {
    const userRecord = await sql`
    SELECT id FROM "caluser" WHERE "email" = ${email} LIMIT 1;
    `;
    let userId = null;

    if (userRecord.length > 0) {
      userId = userRecord[0].id;
    } else {
      console.error("User not found:", userId);
      console.log("user record is", userRecord);
      console.log("email being queried is", email);
      console.log("neonUser is", neonUser);
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

    // Put the rest of the info to do with schools as you build it e.g. school_staff, school etc

    if (updateCaluserResult) {
      console.log("Caluser updated successfully");
    }
  } catch (error) {
    console.error("Error updating caluser:", error);
  }
}

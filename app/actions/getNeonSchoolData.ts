"use server";

import { neon } from "@neondatabase/serverless";

export async function getNeonSchoolData(member: Member) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const neonSchoolData = await sql`
    SELECT
    s.id as school_id,
    s.la_code,
    s.la_name,
    s.establishment_number,
    s.establishment_type,
    s.establishment_type_group,
    s.phase_of_education,
    s.street,
    s.locality,
    s.town,
    s.postcode,
    s.school_website,
    s.telephone,
    s.establishment_name
    FROM school s
    JOIN school_staff ss ON s.id = ss.school_id
    WHERE ss.email = ${member[0].email}
    `;

  return neonSchoolData;
}

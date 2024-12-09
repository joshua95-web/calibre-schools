"use server";

import { neon } from "@neondatabase/serverless";

export async function getSchoolData(neonUser: neonUser) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const neonSchoolData = await sql`
    SELECT
    id,
    created_by_id,
    updated_by_id,
    live,
    inactive_date,
    inactive_reason,
    school_ref,
    la_code,
    la_name,
    est_number,
    est_type,
    est_type_group,
    phase_of_education,
    website,
    telephone,
    notes,
    school_name,
    school_type,
    school_slug,
    created_at,
    updated_at,
    caluser_id
    FROM "school" WHERE "caluser_id" = ${neonUser[0].id} LIMIT 1
    `;

  return neonSchoolData;
}

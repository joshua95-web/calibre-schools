"use server";

import { neon } from "@neondatabase/serverless";

export async function getNeonSchoolData(member: Member) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const neonSchoolData = await sql`
    SELECT
    s.id,
    s.created_by_id,
    s.updated_by_id,
    s.live,
    s.inactive_date,
    s.inactive_reason,
    s.school_ref,
    s.la_code,
    s.la_name,
    s.est_number,
    s.est_type,
    s.est_type_group,
    s.phase_of_education,
    s.website,
    s.telephone,
    s.notes,
    s.school_name,
    s.school_type,
    s.school_slug,
    s.created_at,
    s.updated_at,
    member.caluser_id
    FROM member
    JOIN member_school_join msj ON msj.member_id = member.id
    JOIN school s ON s.id = msj.school_id 
    WHERE member.id = ${member[0].id}
    LIMIT 1
    `;

  return neonSchoolData;
}

// needs to be connected via member table or school_staff table, not caluser table

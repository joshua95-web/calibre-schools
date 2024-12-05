"use server";

import { neon } from "@neondatabase/serverless";

interface SchoolData {
  id: number;
  laCode: number | null;
  laName: string | null;
  establishmentNum: number | null;
  establishmentName: string;
  establishmentType: string | null;
  establishmentTypeGroup: string | null;
  phaseOfEducation: string | null;
  website: string | null;
  telephone: number | null;
  created_by_id: string; // Caluser ID from your current user
}

export async function sendSchoolData(neonUser: neonUser, school: SchoolData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  
  const school_ref = school.id;
  const la_code = school.laCode;
  const la_name = school.laName;
  const est_number = school.establishmentNum;
  const est_type = school.establishmentType;
  const est_type_group = school.establishmentTypeGroup;
  const phase_of_education = school.phaseOfEducation;
  const website = school.website;
  const telephone = school.telephone;
  const school_name = school.establishmentName;
  const created_by_id = school.created_by_id;

  // rework this with joins in mind

  try {
    const result = await sql`
    INSERT INTO "school" (
    school_ref,
        la_code,
        la_name,
        est_number,
        est_type,
        est_type_group,
        phase_of_education,
        website,
        telephone,
        school_name,
        created_by_id
    )
        VALUES (
    ${school_ref},             -- school_ref
    ${la_code},                -- la_code
    ${la_name},                -- la_name
    ${est_number},             -- est_number
    ${est_type},               -- est_type
    ${est_type_group},         -- est_type_group
    ${phase_of_education},     -- phase_of_education
    ${website},                -- website
    ${telephone},              -- telephone
    ${school_name},            -- school_name
    ${created_by_id}           -- created_by_id
  )
    ON CONFLICT (school_ref) DO UPDATE
      SET
        la_code = EXCLUDED.la_code,
        la_name = EXCLUDED.la_name,
        est_number = EXCLUDED.est_number,
        est_type = EXCLUDED.est_type,
        est_type_group = EXCLUDED.est_type_group,
        phase_of_education = EXCLUDED.phase_of_education,
        website = EXCLUDED.website,
        telephone = EXCLUDED.telephone,
        school_name = EXCLUDED.school_name,
        updated_at = NOW(),
        updated_by_id = ${created_by_id};
        `;
    console.log("School added successfully:", result);
  } catch (error) {
    console.error("Error updating school:", error);
  }
}

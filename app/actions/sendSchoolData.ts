"use server";

import { neon } from "@neondatabase/serverless";

interface FormData {
  schoolData: schoolImport;
}

export async function sendSchoolData(neonUser: neonUser, formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const schoolData = formData.schoolData;

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
    ${schoolData.Id}, --school_ref
    ${schoolData.laCode}, --la_code
    ${schoolData.laName}, --la_name
    ${schoolData.establishmentNum}, --est_number
    ${schoolData.establishmentType}, --est_type
    ${schoolData.establishmentTypeGroup}, --est_type_group
    ${schoolData.phaseOfEducation}, --phase_of_education
    ${schoolData.website}, --website
    ${schoolData.telephone}, --telephone
    ${schoolData.establishmentName}, --school_name
    ${neonUser[0].id} --created_by_id
    )
    ON CONFLICT (id) DO UPDATE
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
        updated_by_id = ${neonUser[0].id};
    `;

    console.log("School data sent successfully:", result);
  } catch (error) {
    console.error("Error sending school data:", error);
  }
}

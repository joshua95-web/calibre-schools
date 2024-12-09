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

  try {
    const memberData = await sql`
  SELECT id
  FROM "member"
  WHERE caluser_id = ${neonUser[0].id}
  LIMIT 1
  `;

    if (memberData.length === 0) {
      throw new Error("No member record found for this user");
    }

    const memberId = memberData[0].id;

    const schoolData = formData.schoolData;

    const existingJoin = await sql`
  SELECT school_id
  FROM member_school_join
  WHERE member_id = ${memberId}
  LIMIT 1;
  `;

    if (existingJoin.length > 0) {
      throw new Error("This user is already associated with a school");
    } else {
      const sendSchoolDataResult = await sql`
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
    RETURNING id;
    `;

      const schoolId = sendSchoolDataResult[0].id;

      await sql`
  INSERT INTO member_school_join (member_id, school_id)
  VALUES (${memberId}, ${schoolId})
  ON CONFLICT (member_id, school_id) DO NOTHING;
  `;
    }
    console.log("School and member-school join data sent successfully");
  } catch (error) {
    console.error("Error sending school data", error);
  }
}

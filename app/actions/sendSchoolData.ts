"use server";

import { neon } from "@neondatabase/serverless";
import { Snowflake } from "@theinternetfolks/snowflake";

interface FormData {
  schoolData: schoolImport;
  first_name: string;
  last_name: string;
  prefix: string;
  mobile: string;
}

export async function sendSchoolData(email: string, formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL);

  const first_name = formData.first_name;
  const last_name = formData.last_name;
  const prefix = formData.prefix;
  const mobile = formData.mobile;

  try {
    const memberData = await sql`
  SELECT id
  FROM "member"
  WHERE email = ${email}
  LIMIT 1
  `;

    if (memberData.length === 0) {
      throw new Error("No member record found for this user");
    }

    // const memberId = memberData[0].id;

    const schoolData = formData.schoolData;

    //   const existingJoin = await sql`
    // SELECT id
    // FROM school_staff
    // WHERE member_id = ${memberId}
    // LIMIT 1;
    // `;

    //   if (existingJoin.length > 0) {
    //     throw new Error("This user is already associated with a school");
    //   } else {

    const schoolId = Snowflake.generate({ timestamp: Date.now() });

    const existingSchool = await sql`
    SELECT establishment_name
    FROM school
    WHERE establishment_name = ${schoolData.establishmentName}
    `;

    if (existingSchool.length > 0) {
      console.log("School already exists in the database");
      return {
        message: "School already exists in the database, no insert performed",
      };
    } else {
      const sendSchoolDataResult = await sql`
    INSERT INTO "school" (
    id,
    la_code,
    la_name,
    establishment_number,
    establishment_type,
    establishment_type_group,
    phase_of_education,
    street,
    locality,
    town,
    postcode,
    school_website,
    telephone,
    establishment_name
    )
    VALUES (
    ${schoolId}, --id
    ${schoolData.laCode}, --la_code
    ${schoolData.laName}, --la_name
    ${schoolData.establishmentNum}, --est_number
    ${schoolData.establishmentType}, --est_type
    ${schoolData.establishmentTypeGroup}, --est_type_group
    ${schoolData.phaseOfEducation}, --phase_of_education
    ${schoolData.street}, --street
    ${schoolData.locality}, --locality
    ${schoolData.town}, --town
    ${schoolData.postcode}, --postcode
    ${schoolData.website}, --website
    ${schoolData.telephone}, --telephone
    ${schoolData.establishmentName} --school_name
    )
    RETURNING id;
    `;
      const existingMemberSchool = await sql`
    SELECT id
    FROM member_school
    WHERE member_id = ${memberId} AND school_id = ${schoolId}
  `;

      if (existingMemberSchool.length > 0) {
        console.log("Member-school association already exists");
      } else {
        await sql`
      INSERT INTO member_school (
        member_id, school_id, main_contact_id
      )
      VALUES (
        ${memberData[0].id}, -- member_id
        ${schoolId}, -- school_id
        ${memberData[0].id} -- main_contact_id
      )
    `;
      }

      // send schoolStaff

      const existingSchoolStaff = await sql`
      SELECT id
      FROM school_staff
      WHERE email = ${email}
      `;

      if (existingSchoolStaff.length > 0) {
        console.log("School staff record already exists for this user");
      } else {
        try {
          // schoolStaff data send
          await sql`
        INSERT INTO school_staff (title, first_name, last_name, email, mobile, school_id)
        VALUES (${prefix}, ${first_name}, ${last_name}, ${email}, ${mobile}, ${sendSchoolDataResult[0].id})
        `;
        } catch (error) {
          console.error("Error updating school_staff: ", error);
        }
      }
    }

    console.log("School and member-school join data sent successfully");
  } catch (error) {
    console.error("Error sending school data", error);
  }
}

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
      await sql`
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
      // 1. SCHOOL_STAFF: Insert or fetch staff ID
      let staffId: string | undefined;

      const existingSchoolStaff = await sql`
  SELECT id
  FROM school_staff
  WHERE email = ${email}
`;

      // If a staff record already exists, use it.
      if (existingSchoolStaff.length > 0) {
        staffId = existingSchoolStaff[0].id; // we’ll re-use this existing staff UUID
        console.log("School staff record already exists for this user");
      } else {
        // Otherwise, insert a new staff record and capture the UUID
        try {
          const [newStaff] = await sql`
      INSERT INTO school_staff (
        id, title, first_name, last_name, email, mobile, school_id
      )
      VALUES (
        gen_random_uuid(),      -- or uuid_generate_v4() if you prefer
        ${formData.prefix}, 
        ${formData.first_name}, 
        ${formData.last_name}, 
        ${email}, 
        ${formData.mobile}, 
        ${schoolId}  -- from your earlier insert or from your code
      )
      RETURNING id;
    `;
          staffId = newStaff.id;
        } catch (error) {
          console.error("Error inserting new school_staff:", error);
          throw error; // or handle however you like
        }
      }

      // 2. MEMBER_SCHOOL: Now insert, referencing staffId in main_contact_id
      //    (Only do this if we *did* get a valid staffId)
      if (!staffId) {
        throw new Error(
          "No staffId found or created; cannot create member_school record"
        );
      }

      await sql`
  INSERT INTO member_school (
    member_id, 
    school_id, 
    main_contact_id
  )
  VALUES (
    ${memberData[0].id}, 
    ${schoolId}, 
    ${staffId}
  )
`;
    }

    console.log("School and member-school join data sent successfully");
  } catch (error) {
    console.error("Error sending school data", error);
  }
}

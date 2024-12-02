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

export async function sendSchoolData(school: SchoolData) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
}

// rework this with joins in mind

try {

    const result = await sql `
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
        created_by_id_caluser_id
    )
        VALUES (
        ${school.id},                  -- school_ref
        ${school.laCode},              -- la_code
        ${school.laName},              -- la_name
        ${school.establishmentNum},    -- est_number
        ${school.establishmentType},   -- est_type
        ${school.establishmentTypeGroup}, -- est_type_group
        ${school.phaseOfEducation},    -- phase_of_education
        ${school.website},             -- website
        ${school.telephone},           -- telephone
        ${school.establishmentName},   -- school_name
        ${school.created_by_id}        -- created_by_id_caluser_id
    `
}
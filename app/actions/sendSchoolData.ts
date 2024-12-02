"use server";

import { neon } from "@neondatabase/serverless";

interface FormData {
    first_name: string;
    last_name: string;
    prefix: string;
}
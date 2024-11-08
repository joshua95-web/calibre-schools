"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { sendClerkData } from "../actions/sendClerkData";

export default async function PostSignup() {
  const user = await currentUser();

  if (user) {
    await sendClerkData(user);
  }

  redirect("/dashboard");

  return null;
}

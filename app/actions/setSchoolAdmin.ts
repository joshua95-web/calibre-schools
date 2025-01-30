"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export async function setSchoolAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorised: No user ID found");
  }

  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetaData: {
        role: "school_admin",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error };
  }
}

"use server";

export async function setSchoolAdmin(userId: string) {
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

  if (!CLERK_SECRET_KEY) {
    throw new Error("No Clerk secret key found");
  }

  const response = await fetch(
    `https://api.clerk.com/v1/users/${userId}/metadata`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: {
          role: "school_admin",
        },
      }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update user role: ${JSON.stringify(errorData)}`);
  }
  return response.json();
}

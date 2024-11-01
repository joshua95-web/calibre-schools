import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { role, userId } = await body.json();

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });
  return NextResponse.json({ success: true });
}

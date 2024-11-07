import { currentUser, auth } from "@clerk/nextjs/server";
import { sendClerkData } from "../actions/sendClerkData";

export default async function handler() {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();

    if (user) {
      await sendClerkData(user);
    }
  }
}

"use client";

import { OrganizationSwitcher, useOrganizationList } from "@clerk/nextjs";

export default function DisplayUserOrgData(data: any) {
  const userOrgData = useOrganizationList(data.userMemberships);

  // Convert to array based on the actual structure
  const userOrgArray = userOrgData || []; // Adjust if needed
  console.log(userOrgArray);

  return <OrganizationSwitcher />;
}

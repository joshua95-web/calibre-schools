"use client";
import { UserButton } from "@clerk/nextjs";

interface NavbarProps {
  memberNumber: string;
  schoolName: string;
}

export default function Navbar({ memberNumber, schoolName }: NavbarProps) {
  return (
    <div>
      <div className="p-2">
        <UserButton showName={true} appearance={{}} />
      </div>
      <div className="block border border-transparent px-3 py-4 text-base font-semibold hover:text-calibre-citrus">
        <p>Calibre Member Number: </p>
        {memberNumber}
      </div>
      <div className="block border border-transparent px-3 py-4 text-base font-semibold hover:text-calibre-citrus">
        {" "}
        <h1>{schoolName}</h1>
      </div>
    </div>
  );
}

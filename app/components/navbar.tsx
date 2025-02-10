"use client";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { IoSchool } from "react-icons/io5";
import Image from "next/image";

interface NavbarProps {
  memberNumber: string;
  schoolName: string;
}

export default function Navbar({ memberNumber, schoolName }: NavbarProps) {
  return (
    <div className="relative">
      <div className="relative z-10 flex items-center justify-between gap-8 px-8 py-4 bg-slate-900 text-slate-100 lg:space-x-12">
        <div className="flex-1 flex justify-start">
          <div className=" text-white font-semibold">
            <Image
              src="/branding/learning-icon-orange.svg"
              alt="Calibre Learning Logo"
              width={56}
              height={56}
              className="hw-auto"
            />
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
          <div className="flex items-center">
            <UserButton showName={true} appearance={{}} />
          </div>
          <div className="flex items-center border border-transparent px-3 py-4 text-base font-semibold">
            <p>Calibre Member Number: </p>
            <span>{memberNumber}</span>
          </div>
          <div className="text-right block border border-transparent px-3 py-4 text-base font-semibold">
            {" "}
            <div className="flex text-lg bg-slate-700 p-2 rounded-md">
              <IoSchool /> <h1>{schoolName}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="bg-calibre-citrus px-5 py-2  hover:bg-amber-400 rounded-md text-white font-semibold">
            <SignOutButton />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-full h-[80px] opacity-100 blur-xl pointer-events-none"
        aria-hidden={true}
      >
        <div>
          <Image src="/images/navbarGlow.png" alt="" fill={true} />
        </div>
      </div>
    </div>
  );
}
